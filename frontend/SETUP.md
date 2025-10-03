# Frontend Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── books/          # Book-related components
│   ├── reviews/        # Review-related components
│   └── common/         # Common/shared components
├── pages/              # Page components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── styles/             # Theme and styling configurations
```

## Features

### Authentication
- User signup and login
- JWT token management
- Protected routes
- Automatic token refresh

### Book Management
- Add, edit, and delete books
- Search and filter books
- Pagination
- Book details view

### Review System
- Add, edit, and delete reviews
- Star ratings (1-5)
- Review statistics and charts
- User review history

### UI/UX
- Responsive design
- Dark/light mode toggle
- Material-UI components
- Tailwind CSS styling
- Loading states and error handling

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure backend is running on port 5000
   - Check CORS settings in backend
   - Verify API base URL in `.env`

2. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all imports are correct

3. **Authentication Issues**
   - Clear localStorage
   - Check JWT token format
   - Verify backend authentication endpoints