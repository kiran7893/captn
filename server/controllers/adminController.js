const User = require("../models/User");
const validator = require("validator");

// Helper function for input validation
const validateUserInput = (data) => {
  const errors = {};

  if (data.email && !validator.isEmail(data.email)) {
    errors.email = "Invalid email format";
  }

  if (data.name && (data.name.length < 2 || data.name.length > 50)) {
    errors.name = "Name must be between 2 and 50 characters";
  }

  if (data.role && !["user", "admin", "moderator"].includes(data.role)) {
    errors.role = "Invalid role specified";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "-createdAt";
    const search = req.query.search || "";

    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(searchQuery)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(searchQuery);

    res.json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: users,
    });
  } catch (err) {
    console.error(`Error in getAllUsers: ${err.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve users",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Prevent updating sensitive fields
    const updates = {
      ...req.body,
      password: undefined,
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined,
    };

    // Validate input
    const { isValid, errors } = validateUserInput(updates);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // Check if email is being updated and is already in use
    if (updates.email) {
      const existingUser = await User.findOne({
        email: updates.email,
        _id: { $ne: req.params.id },
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already in use",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: "-password -resetPasswordToken -resetPasswordExpire",
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(`Error in updateUser: ${err.message}`);
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// New function to get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
          },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        total: totalUsers,
        active: activeUsers,
        roleDistribution: stats,
      },
    });
  } catch (err) {
    console.error(`Error in getUserStats: ${err.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve user statistics",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: "Users cannot delete their own account",
      });
    }

    // Find the user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Remove the user
    await user.remove();

    res.json({
      success: true,
      message: `User with ID ${req.params.id} successfully deleted.`,
    });
  } catch (err) {
    console.error(`Error in deleteUser: ${err.message}`);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
};
