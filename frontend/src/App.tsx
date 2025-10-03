import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import { ThemeProvider } from "./components/ThemeProvider"
import { Navbar } from "./components/Navbar"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { PublicRoute } from "./components/PublicRoute"
import Landing from "./pages/Landing"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import BookDetail from "./pages/BookDetail"
import AddBook from "./pages/AddBook"
import EditBook from "./pages/EditBook"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"
import { TooltipProvider } from "./components/ui/tooltip"
import { Toaster } from "./components/ui/toaster"
import { Toaster as Sonner } from 'sonner'
import { ThemeToggle } from "./components/ThemeToggle"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="turnthepage-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
              <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
              <Route path="/edit-book/:id" element={<ProtectedRoute><EditBook /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <div className="fixed bottom-4 right-4 z-50">
              <ThemeToggle />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App
