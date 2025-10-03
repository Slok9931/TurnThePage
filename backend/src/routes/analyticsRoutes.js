// src/routes/analyticsRoutes.js

const express = require("express");
const {
  getBookAnalytics,
  getGeneralAnalytics,
} = require("../controllers/analyticsController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Route to get analytics for a specific book
router.get("/book/:bookId", getBookAnalytics);

// Route to get general analytics
router.get("/general", authenticate, getGeneralAnalytics);

module.exports = router;
