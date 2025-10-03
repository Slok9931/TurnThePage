// src/controllers/bookController.js

const Book = require("../models/Book");
const bookService = require("../services/bookService");

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const bookData = req.body;
    const newBook = await bookService.createBook(bookData, req.user.id);
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

// Get all books with pagination
exports.getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      genre,
      skip,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Convert to numbers
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skipNum = skip ? parseInt(skip) : (pageNum - 1) * limitNum;

    // Build query object
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } },
      ];
    }

    if (genre) {
      // Handle genre filtering with split genres (comma, slash, pipe separated)
      query.genre = { $regex: genre, $options: "i" };
    }

    // Get total count for pagination info
    const total = await Book.countDocuments(query);

    // Build sort object
    let sortObject = {};
    if (sortBy === "publishedYear") {
      sortObject.publishedYear = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "averageRating") {
      // For average rating, we'll sort after aggregation
      sortObject = null;
    } else {
      sortObject.createdAt = sortOrder === "asc" ? 1 : -1;
    }

    // Use aggregation pipeline to include average rating
    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "bookId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $avg: "$reviews.rating" },
              else: 0,
            },
          },
          reviewCount: { $size: "$reviews" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "addedBy",
          foreignField: "_id",
          as: "addedBy",
        },
      },
      {
        $unwind: "$addedBy",
      },
      {
        $project: {
          title: 1,
          author: 1,
          description: 1,
          genre: 1,
          publishedYear: 1,
          averageRating: 1,
          reviewCount: 1,
          createdAt: 1,
          updatedAt: 1,
          "addedBy._id": 1,
          "addedBy.name": 1,
        },
      },
    ];

    // Add sorting based on sortBy parameter
    if (sortBy === "averageRating") {
      pipeline.push({
        $sort: { averageRating: sortOrder === "asc" ? 1 : -1, createdAt: -1 },
      });
    } else if (sortObject) {
      pipeline.push({ $sort: sortObject });
    }

    // Add pagination
    pipeline.push({ $skip: skipNum });
    pipeline.push({ $limit: limitNum });

    const books = await Book.aggregate(pipeline);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = skipNum + limitNum < total;
    const hasPrev = skipNum > 0;

    res.json({
      success: true,
      books,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalBooks: total,
        hasNext,
        hasPrev,
        limit: limitNum,
        skip: skipNum,
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching books",
    });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await bookService.getBookById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving book", error: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedBook = await bookService.updateBook(
      bookId,
      req.body,
      req.user.id
    );
    if (!updatedBook) {
      return res
        .status(404)
        .json({ message: "Book not found or not authorized" });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await bookService.deleteBook(bookId, req.user.id);
    if (!deletedBook) {
      return res
        .status(404)
        .json({ message: "Book not found or not authorized" });
    }
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};
