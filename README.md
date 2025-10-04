# 📚 TurnThePage - Social Book Review Platform

A comprehensive full-stack social media platform for book enthusiasts, built with the MERN stack. Connect with fellow readers, discover new books, share reviews, and engage in a vibrant literary community.

![TurnThePage Banner](./frontend/public/Logo.png)

## ✨ Features

### 📖 Core Functionality

- **User Authentication & Profiles**: Secure JWT-based authentication with customizable user profiles
- **Book Management**: Add, edit, and discover books with detailed information and cover images
- **Review System**: Write and share detailed reviews with star ratings
- **Social Interactions**: Follow users, like posts, comment on reviews
- **Activity Feed**: Real-time feed of community activities and interactions

### � Advanced Features

- **Search & Discovery**: Advanced search functionality for books and users
- **Analytics Dashboard**: Personal reading statistics and insights
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Real-time Updates**: Live notifications and activity tracking
- **Social Statistics**: Follower counts, reading progress, and engagement metrics

### 🎯 Social Features

- **Follow System**: Connect with other book lovers
- **Activity Tracking**: See what your friends are reading and reviewing
- **Like & Comment System**: Engage with posts and reviews
- **User Suggestions**: Discover new people to follow based on reading preferences
- **Reading Goals**: Set and track yearly reading targets

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **Axios** for API calls

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## 📁 Project Structure

```
TurnThePage/
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── api/            # API service functions
│   │   ├── components/     # Reusable React components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic services
│   │   ├── config/          # Configuration files
│   │   └── utils/          # Utility functions
│   ├── scripts/            # Database seeding scripts
│   └── package.json
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** database (local or MongoDB Atlas)

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Slok9931/TurnThePage.git
cd TurnThePage
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
```

**Environment Variables (.env):**

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:8080

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
```

**Frontend Environment Variables (.env):**

```env
VITE_API_URL=http://localhost:5000/api
```

#### 4. Database Setup & Seeding

**Start MongoDB** (if running locally):

```bash
mongod
```

**Seed the Database** (optional - adds sample data):

```bash
cd backend
npm run seed
```

This will create:

- 10 sample users with hashed passwords
- 20+ sample books across various genres
- 50+ sample reviews and ratings
- Social connections and activities

#### 5. Start the Application

**Start Backend Server:**

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Start Frontend Development Server:**

```bash
cd frontend
npm run dev
# Application runs on http://localhost:8080
```

## 📡 API Documentation

### Authentication Endpoints

```
POST /api/auth/signup     # User registration
POST /api/auth/login      # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
```

### Book Management

```
GET    /api/books           # Get all books (with pagination)
POST   /api/books           # Add new book
GET    /api/books/:id       # Get book details
PUT    /api/books/:id       # Update book (owner only)
DELETE /api/books/:id       # Delete book (owner only)
GET    /api/books/search    # Search books
```

### Review System

```
GET    /api/reviews/book/:bookId    # Get book reviews
POST   /api/reviews                 # Add review
PUT    /api/reviews/:id             # Update review (owner only)
DELETE /api/reviews/:id             # Delete review (owner only)
```

### Social Features

```
POST   /api/social/follow/:userId    # Follow/unfollow user
GET    /api/social/followers/:userId # Get user followers
GET    /api/social/following/:userId # Get user following
POST   /api/social/like/:reviewId    # Like/unlike review
```

### User Management

```
GET    /api/users/search            # Search users
GET    /api/users/suggestions       # Get suggested users
GET    /api/users/:id               # Get user profile
POST   /api/users/upload-avatar     # Upload profile picture
```

### Activity Feed

```
GET    /api/activities/feed         # Get user activity feed
GET    /api/activities/public       # Get public activities
```

## 🎨 UI Components & Design

The application uses a modern, responsive design system built with:

- **Design System**: Custom color palette with primary (orange/amber) and secondary (dark blue) colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Reusable components built with shadcn/ui
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Full theme support with system preference detection
- **Accessibility**: ARIA labels and keyboard navigation support

### Color Palette

```css
/* Primary Colors */
--primary: 38 92% 50%        /* Orange/Amber */
--secondary: 240 60% 25%     /* Dark Blue */

/* UI Colors */
--background: 0 0% 100%      /* White */
--foreground: 222 47% 11%    /* Dark Gray */
--muted: 210 40% 96%         /* Light Gray */
--accent: 240 80% 60%        /* Bright Blue */
```

## � Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  username: String (optional),
  bio: String,
  profilePicture: { url, publicId },
  coverPicture: { url, publicId },
  location: String,
  website: String,
  favoriteGenres: [String],
  socialStats: {
    followersCount: Number,
    followingCount: Number,
    booksAddedCount: Number,
    reviewsCount: Number
  }
}
```

### Book Model

```javascript
{
  title: String,
  author: String,
  description: String,
  genre: String,
  publishedYear: Number,
  coverImage: { url, publicId },
  addedBy: ObjectId (User ref),
  averageRating: Number,
  totalReviews: Number
}
```

### Review Model

```javascript
{
  bookId: ObjectId (Book ref),
  userId: ObjectId (User ref),
  rating: Number (1-5),
  reviewText: String,
  likes: [ObjectId] (User refs),
  comments: [{
    userId: ObjectId (User ref),
    comment: String,
    createdAt: Date
  }]
}
```

## � Available Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌟 Key Features in Detail

### 📱 Responsive Social Platform

- **Activity Feed**: See real-time updates from users you follow
- **User Profiles**: Comprehensive profiles with reading statistics
- **Social Interactions**: Like, comment, and engage with the community
- **Follow System**: Build your reading network

### 📚 Comprehensive Book Management

- **Book Discovery**: Browse and search through extensive book collections
- **Personal Libraries**: Track books you've added and reviewed
- **Review System**: Write detailed reviews with star ratings
- **Image Uploads**: Add book covers and profile pictures

### 📈 Analytics & Insights

- **Reading Statistics**: Track your reading progress and goals
- **Social Analytics**: Monitor your engagement and followers
- **Personalized Dashboard**: Custom dashboard with your activity
- **Achievement System**: Unlock reading milestones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Slok Tulsyan**

- GitHub: [@Slok9931](https://github.com/Slok9931)
- Email: sloktulsyan@gmail.com

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **shadcn/ui** for the beautiful component library
- **MongoDB** for the flexible database solution
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/Slok9931/TurnThePage/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your setup and the issue

---

**Happy Reading! 📚✨**

*Built with ❤️ by the TurnThePage team*̌
