## 🎯 Objective
Build a Book Review Platform where users can sign up, log in, add books, and review books. The goal is to test your skills in MongoDB, Express, React, Node.js (MERN) along with authentication, CRUD operations, and frontend integration.

## 🔹 Functional Requirements
1. User Authentication:
    - Sign up with Name, Email (unique), Password (hashed)
    - Login with email & password
    - Return JWT token on successful login
    - Use middleware to protect API routes
2. Book Management:
    - Add books: Title, Author, Description, Genre, Published Year
    - Only book creator can edit/delete
    - All users can view books list
    - Implement pagination (5 books per page)
3. Review System:
    - Add reviews: Rating (1-5 stars), Review Text
    - Users can edit/delete their own reviews
    - Show all reviews and average rating on book details

## 🔹 Technical Requirements
- **Backend**: Node.js + Express + MongoDB, Mongoose schemas, bcrypt, JWT, MVC structure
- **Frontend**: React Router, Context API, Axios/Fetch, Tailwind CSS/Bootstrap
- **Database**: MongoDB Atlas with User, Book, Review schemas

## 🔹 Frontend Pages Required
- Signup Page – form to register new user
- Login Page – form to login and store JWT token in localStorage
- Book List Page (Home) – shows all books with pagination
- Book Details Page – show book info, reviews, and average rating
- Add/Edit Book Page – form for logged-in users to add or edit books
- Profile Page (bonus) – show user's added books and reviews

## ⭐ Bonus Features (Optional but Impressive)
- Search & Filter: Search books by title/author or filter by genre
- Sorting: Sort books by published year or average rating
- Charts: Show rating distribution for a book (using Recharts)
- Dark/Light Mode toggle
- Deployment: Deploy backend (Render/Heroku/AWS) + frontend (Vercel/Netlify)
- Postman collection for APIs

## 🔹 Database Schema Design
- **User Schema**: { name, email, password }
- **Book Schema**: { title, author, description, genre, year, addedBy (userId ref) }
- **Review Schema**: { bookId (ref), userId (ref), rating, reviewText }

## 🔹 Deliverables
- GitHub repository with /backend and /frontend folders
- README.md with setup instructions and API documentation
- Deployed links (bonus: Postman collection)

## ✅ Evaluation Criteria
- Code quality & folder structure
- Authentication & security (JWT, bcrypt)
- API design (RESTful, proper error handling)
- Frontend integration (React + API calls)
- UI/UX (clean forms, lists, navigation)
- Database schema design (relations: user ↔ book ↔ review)
- Bonus: Deployment, charts, search/sort, dark modě