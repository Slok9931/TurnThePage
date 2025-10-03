# BookVerse - Book Review System

A modern, full-stack book review application built with React, TypeScript, and Tailwind CSS.

## Features

- 📚 Browse and discover books
- ⭐ Write and manage reviews
- 🔐 User authentication (signup/login)
- 👤 Personal profile with your books and reviews
- ✏️ Add and edit books
- 🎨 Beautiful, responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router for navigation
- Axios for API calls
- React Query for state management

### Backend
- Express.js API (separate repository)
- MongoDB database
- JWT authentication

## Project Structure

```
src/
├── api/           # API service files
│   ├── auth.ts    # Authentication API calls
│   ├── books.ts   # Books API calls
│   └── reviews.ts # Reviews API calls
├── components/    # Reusable components
│   ├── ui/        # shadcn UI components
│   ├── Navbar.tsx
│   ├── BookCard.tsx
│   ├── ReviewCard.tsx
│   └── StarRating.tsx
├── hooks/         # Custom React hooks
│   └── useAuth.tsx # Authentication context
├── lib/           # Utilities
│   ├── api.ts     # Axios instance
│   └── utils.ts   # Helper functions
├── pages/         # Page components
│   ├── Landing.tsx
│   ├── Signup.tsx
│   ├── Login.tsx
│   ├── Home.tsx
│   ├── BookDetail.tsx
│   ├── AddBook.tsx
│   ├── EditBook.tsx
│   ├── Profile.tsx
│   └── NotFound.tsx
└── types/         # TypeScript interfaces
    └── index.ts
```

## Setup Instructions

### Prerequisites
- Node.js & npm installed
- Backend API running (default: http://localhost:5000)

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory:
```sh
cp .env.example .env
```

4. Update the `.env` file with your backend API URL:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Environment Variables

Create a `.env` file with the following variable:

- `VITE_API_URL`: Your backend API URL (default: http://localhost:5000/api)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Detail

### Authentication
- Secure JWT-based authentication
- Protected routes requiring login
- Persistent login sessions

### Books Management
- Browse all books with search functionality
- View detailed book information
- Add new books (authenticated users)
- Edit your own books
- Delete your own books

### Reviews System
- Rate books with 1-5 stars
- Write detailed reviews
- Edit your own reviews
- Delete your own reviews
- View review statistics and average ratings

### User Profile
- View your added books
- View your written reviews
- Track your reading activity

## Design System

The application uses a warm, literary-inspired design system:
- Primary color: Warm amber (#f59e0b)
- Secondary color: Deep indigo
- Backgrounds: Soft neutrals
- Typography: Clean, readable fonts
- Responsive design for all screen sizes

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
