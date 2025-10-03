const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authService = {
  signUp: async (userData) => {
    const { name, email, password } = userData;
    const newUser = new User({ name, email, password });
    await newUser.save();
    return newUser;
  },

  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return { token, user };
  },

  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};

module.exports = authService;
