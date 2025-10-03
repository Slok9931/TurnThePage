const express = require("express");
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  toggleBookLike,
  uploadBookCover,
} = require("../controllers/bookController");
const { authenticate } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

const router = express.Router();

// Route to add a new book
router.post("/", authenticate, upload.single("coverImage"), addBook);

// Route to get all books with pagination
router.get("/", getAllBooks);

// Route to get a book by ID
router.get("/:id", getBookById);

// Route to update a book by ID
router.put("/:id", authenticate, updateBook);

// Route to delete a book by ID
router.delete("/:id", authenticate, deleteBook);

// Route to get user's books
router.get("/user/my-books", authenticate, async (req, res) => {
  try {
    const Book = require("../models/Book");
    const books = await Book.find({ addedBy: req.user.id }).populate(
      "addedBy",
      "name"
    );
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to like/unlike a book
router.post("/:id/like", authenticate, toggleBookLike);

// Route to upload book cover
router.post(
  "/:id/cover",
  authenticate,
  upload.single("coverImage"),
  uploadBookCover
);

module.exports = router;
