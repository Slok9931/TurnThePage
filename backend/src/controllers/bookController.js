// src/controllers/bookController.js

const Book = require("../models/Book");
const User = require("../models/User");
const bookService = require("../services/bookService");
const {
  uploadBookCover,
  deleteFromCloudinary,
} = require("../config/cloudinary");
const { createActivity } = require("./activityController");

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const bookData = req.body;

    // Handle cover image upload if provided
    if (req.file) {
      const uploadResult = await uploadBookCover(req.file.buffer);
      bookData.coverImage = {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      };
    }

    const newBook = await bookService.createBook(bookData, req.user._id);

    // Update user's book count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "socialStats.booksAddedCount": 1 },
    });

    // Create activity
    await createActivity({
      user: req.user._id,
      type: "book_added",
      title: `Added a new book: ${newBook.title}`,
      description: `${req.user.name} added "${newBook.title}" by ${newBook.author}`,
      relatedBook: newBook._id,
      metadata: {
        bookTitle: newBook.title,
      },
    });

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
      req.user._id
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
    const deletedBook = await bookService.deleteBook(bookId, req.user._id);
    if (!deletedBook) {
      return res
        .status(404)
        .json({ message: "Book not found or not authorized" });
    }

    // Delete cover image from Cloudinary if exists
    if (deletedBook.coverImage && deletedBook.coverImage.publicId) {
      await deleteFromCloudinary(deletedBook.coverImage.publicId);
    }

    // Update user's book count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "socialStats.booksAddedCount": -1 },
    });

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
};

// Like/Unlike a book
exports.toggleBookLike = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingLike = book.likes.find(
      (like) => like.user.toString() === userId
    );

    if (existingLike) {
      // Unlike
      book.likes = book.likes.filter((like) => like.user.toString() !== userId);
      book.likesCount = Math.max(0, book.likesCount - 1);
    } else {
      // Like
      book.likes.push({ user: userId });
      book.likesCount += 1;

      // Create activity for book like
      await createActivity({
        user: userId,
        type: "book_liked",
        title: `Liked "${book.title}"`,
        description: `${req.user.name} liked "${book.title}" by ${book.author}`,
        relatedBook: bookId,
        metadata: {
          bookTitle: book.title,
        },
      });
    }

    await book.save();

    res.json({
      success: true,
      data: {
        isLiked: !existingLike,
        likesCount: book.likesCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating like status",
      error: error.message,
    });
  }
};

// Upload book cover
exports.uploadBookCover = async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if user owns the book
    if (book.addedBy.toString() !== req.user._id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this book",
      });
    }

    // Delete old cover image if exists
    if (book.coverImage && book.coverImage.publicId) {
      await deleteFromCloudinary(book.coverImage.publicId);
    }

    // Upload new cover image
    const uploadResult = await uploadBookCover(req.file.buffer);

    // Update book with new cover image
    book.coverImage = {
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    };
    await book.save();

    res.json({
      success: true,
      data: {
        coverImage: book.coverImage,
      },
    });
  } catch (error) {
    console.error("Error uploading book cover:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading book cover",
    });
  }
};
