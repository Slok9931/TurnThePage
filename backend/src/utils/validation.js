const { body, validationResult } = require("express-validator");

const validateSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("genre").notEmpty().withMessage("Genre is required"),
  body("publishedYear")
    .isNumeric()
    .withMessage("Published Year must be a number"),
];

const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("reviewText").notEmpty().withMessage("Review text is required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateBook,
  validateReview,
  validate,
};
