// src/services/bookService.js

const Book = require("../models/Book");

// Create a new book
const createBook = async (bookData, userId) => {
  const book = new Book({
    ...bookData,
    addedBy: userId,
  });
  return await book.save();
};

// Get all books with pagination
const getAllBooks = async (page = 1, limit = 5) => {
  const books = await Book.find()
    .skip((page - 1) * limit)
    .limit(limit);
  const totalBooks = await Book.countDocuments();
  return { books, totalBooks };
};

// Get a book by ID
const getBookById = async (bookId) => {
  return await Book.findById(bookId).populate("addedBy", "name");
};

// Update a book
const updateBook = async (bookId, bookData) => {
  return await Book.findByIdAndUpdate(bookId, bookData, { new: true });
};

// Delete a book
const deleteBook = async (bookId) => {
  return await Book.findByIdAndDelete(bookId);
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
