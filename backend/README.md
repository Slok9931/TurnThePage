## Backend README.md

# Book Review Platform - Backend

## Overview
This is the backend for the Book Review Platform, built using Node.js, Express, and MongoDB. The application allows users to sign up, log in, manage books, and write reviews.

## Features
- User authentication (sign up, login)
- Book management (add, edit, delete, view)
- Review system (add, edit, delete, view)
- JWT-based authentication for secure API access

## Technologies Used
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing

## Folder Structure
```
src
├── controllers        # Contains controller files for handling requests
├── models             # Contains Mongoose models for User, Book, and Review
├── routes             # Contains route definitions for authentication, books, and reviews
├── middleware         # Contains middleware for authentication and error handling
├── services           # Contains business logic for authentication, books, and reviews
├── config             # Contains configuration files, such as database connection
├── utils              # Contains utility functions for validation and helpers
└── app.js             # Initializes the Express application
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the server:
   ```
   node server.js
   ```

## API Endpoints
- **Authentication**
  - `POST /api/auth/signup` - Register a new user
  - `POST /api/auth/login` - Log in a user

- **Books**
  - `GET /api/books` - Get all books (with pagination)
  - `POST /api/books` - Add a new book
  - `PUT /api/books/:id` - Edit a book
  - `DELETE /api/books/:id` - Delete a book

- **Reviews**
  - `GET /api/reviews/:bookId` - Get all reviews for a book
  - `POST /api/reviews` - Add a review
  - `PUT /api/reviews/:id` - Edit a review
  - `DELETE /api/reviews/:id` - Delete a review

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License.