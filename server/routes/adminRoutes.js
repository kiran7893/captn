// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

router.use(protect);
router.use(authorize("admin"));

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
