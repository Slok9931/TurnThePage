// scripts/seedData.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Import models
const User = require("../src/models/User");
const Book = require("../src/models/Book");
const Review = require("../src/models/Review");

// Sample data
const sampleUsers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
  },
  { name: "Bob Smith", email: "bob@example.com", password: "password123" },
  {
    name: "Charlie Brown",
    email: "charlie@example.com",
    password: "password123",
  },
  { name: "Diana Ross", email: "diana@example.com", password: "password123" },
  {
    name: "Edward Norton",
    email: "edward@example.com",
    password: "password123",
  },
  { name: "Fiona Apple", email: "fiona@example.com", password: "password123" },
  {
    name: "George Lucas",
    email: "george@example.com",
    password: "password123",
  },
  { name: "Helen Hunt", email: "helen@example.com", password: "password123" },
  { name: "Ian Fleming", email: "ian@example.com", password: "password123" },
  {
    name: "Julia Roberts",
    email: "julia@example.com",
    password: "password123",
  },
];

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A classic American novel about the Jazz Age and the American Dream.",
    genre: "Classic Fiction, Literature",
    publishedYear: 1925,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South.",
    genre: "Classic Fiction, Drama",
    publishedYear: 1960,
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description:
      "An epic science fiction novel set in a distant future amidst a feudal interstellar society.",
    genre: "Science Fiction, Fantasy",
    publishedYear: 1965,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description:
      "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    genre: "Romance, Classic Fiction",
    publishedYear: 1813,
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description:
      "A controversial novel about teenage rebellion and alienation.",
    genre: "Coming-of-age, Fiction",
    publishedYear: 1951,
  },
  {
    title: "Lord of the Rings",
    author: "J.R.R. Tolkien",
    description:
      "An epic high fantasy novel about the quest to destroy the One Ring.",
    genre: "Fantasy, Adventure",
    publishedYear: 1954,
  },
  {
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian social science fiction novel about totalitarian control.",
    genre: "Dystopian Fiction, Political Fiction",
    publishedYear: 1949,
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    description:
      "The first book in the magical Harry Potter series about a young wizard.",
    genre: "Fantasy, Young Adult",
    publishedYear: 1997,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about Bilbo Baggins' unexpected journey.",
    genre: "Fantasy, Adventure",
    publishedYear: 1937,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description:
      "A dystopian novel about a technologically advanced future society.",
    genre: "Science Fiction, Dystopian Fiction",
    publishedYear: 1932,
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    description:
      "A mystery thriller involving art, history, and religious conspiracy.",
    genre: "Thriller, Mystery",
    publishedYear: 2003,
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    description:
      "A psychological thriller about a missing wife and her husband.",
    genre: "Psychological Thriller, Mystery",
    publishedYear: 2012,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description:
      "A philosophical novel about a young shepherd's journey to find treasure.",
    genre: "Philosophy, Adventure",
    publishedYear: 1988,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    description: "A fascinating exploration of human history and civilization.",
    genre: "Non-fiction, History",
    publishedYear: 2011,
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    description: "A crime thriller about a journalist and a computer hacker.",
    genre: "Crime Thriller, Mystery",
    publishedYear: 2005,
  },
];

const reviewTexts = [
  "Absolutely loved this book! Couldn't put it down.",
  "A masterpiece of literature. Highly recommended.",
  "Good read, but not my favorite genre.",
  "The characters were well-developed and engaging.",
  "Brilliant storytelling and world-building.",
  "A bit slow at first, but picks up nicely.",
  "One of the best books I've read this year.",
  "Interesting plot but the ending felt rushed.",
  "Beautiful prose and thought-provoking themes.",
  "Not what I expected, but pleasantly surprised.",
  "A classic that everyone should read.",
  "Gripping from start to finish.",
  "The author has a unique writing style.",
  "Perfect for fans of this genre.",
  "Made me think differently about the topic.",
  "Couldn't get into it despite the hype.",
  "A real page-turner with great twists.",
  "Solid writing but predictable plot.",
  "Emotionally powerful and moving.",
  "Great character development throughout.",
];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

async function clearDatabase() {
  console.log("Clearing existing data...");
  await User.deleteMany({});
  await Book.deleteMany({});
  await Review.deleteMany({});
  console.log("Database cleared");
}

async function seedUsers() {
  console.log("Seeding users...");
  const users = [];

  for (const userData of sampleUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    });
    users.push(await user.save());
  }

  console.log(`Created ${users.length} users`);
  return users;
}

async function seedBooks(users) {
  console.log("Seeding books...");
  const books = [];

  for (const bookData of sampleBooks) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const book = new Book({
      ...bookData,
      addedBy: randomUser._id,
    });
    books.push(await book.save());
  }

  console.log(`Created ${books.length} books`);
  return books;
}

async function seedReviews(users, books) {
  console.log("Seeding reviews...");
  let reviewCount = 0;

  // Create reviews for each book with varying amounts
  for (const book of books) {
    // Random number of reviews per book (3-25)
    const numReviews = Math.floor(Math.random() * 23) + 3;

    // Create reviews spread over time (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    for (let i = 0; i < numReviews; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // Skip if user already reviewed this book
      const existingReview = await Review.findOne({
        bookId: book._id,
        userId: randomUser._id,
      });
      if (existingReview) continue;

      // Generate rating with bias towards higher ratings
      let rating;
      const rand = Math.random();
      if (rand < 0.4) rating = 5; // 40% chance of 5 stars
      else if (rand < 0.65) rating = 4; // 25% chance of 4 stars
      else if (rand < 0.85) rating = 3; // 20% chance of 3 stars
      else if (rand < 0.95) rating = 2; // 10% chance of 2 stars
      else rating = 1; // 5% chance of 1 star

      // Random date between 6 months ago and now
      const randomDate = new Date(
        sixMonthsAgo.getTime() +
          Math.random() * (Date.now() - sixMonthsAgo.getTime())
      );

      const review = new Review({
        bookId: book._id,
        userId: randomUser._id,
        rating: rating,
        reviewText: reviewTexts[Math.floor(Math.random() * reviewTexts.length)],
        createdAt: randomDate,
        updatedAt: randomDate,
      });

      await review.save();
      reviewCount++;
    }
  }

  console.log(`Created ${reviewCount} reviews`);
}

async function seedDatabase() {
  try {
    await connectDB();

    console.log("Starting database seeding...");

    // Clear existing data
    await clearDatabase();

    // Seed data
    const users = await seedUsers();
    const books = await seedBooks(users);
    await seedReviews(users, books);

    console.log("Database seeding completed successfully!");

    // Print summary
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalReviews = await Review.countDocuments();

    console.log("\n--- SEEDING SUMMARY ---");
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Total Books: ${totalBooks}`);
    console.log(`Total Reviews: ${totalReviews}`);
    console.log("----------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
