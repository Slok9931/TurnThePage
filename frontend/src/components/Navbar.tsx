import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, User, LogOut, Activity, Home } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const Navbar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? '/home' : '/'} className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-foreground">TurnThePage</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <Activity className="h-4 w-4" />
                   {/* Activities */}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar
                  className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                  onClick={() => navigate('/profile')}
                >
                  <AvatarImage src={user?.profilePicture?.url} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
