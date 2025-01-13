const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserStats,
} = require("../controllers/adminController");
const rateLimit = require("express-rate-limit");

// Rate limiting for admin routes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply protection middleware
router.use(protect);
router.use(authorize("admin", "superadmin"));
router.use(adminLimiter);

// User management routes
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/users/stats", getUserStats);

module.exports = router;
