const express = require("express");
const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Route to add a new book
router.post("/", authenticate, addBook);

// Route to get all books with pagination
router.get("/", getBooks);

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

module.exports = router;
