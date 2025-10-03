const express = require("express");
const { signup, login } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../utils/validation");

const router = express.Router();

// Sign up route
router.post("/signup", validateSignup, signup);

// Login route
router.post("/login", validateLogin, login);

// Get profile route (protected)
router.get(
  "/profile",
  require("../middleware/auth").authenticate,
  async (req, res) => {
    try {
      const User = require("../models/User");
      const user = await User.findById(req.user.id).select("-password");
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
