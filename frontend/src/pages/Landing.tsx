import { Link } from 'react-router-dom'
import { BookOpen, Star, Users, BookMarked, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const Landing = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/50" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-full text-sm font-medium hover-lift">
              <BookOpen className="h-4 w-4 text-primary animate-pulse" />
              <span>Welcome to TurnThePage</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Turn Every Page Into{' '}
              <span className="block md:inline">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a vibrant community of book enthusiasts. Discover, review, and share your literary journey with thousands of passionate readers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              {user ? (
                <Link to="/home">
                  <Button size="lg" className="text-lg px-10 py-6 hover-lift shadow-lg">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="text-lg px-10 py-6 hover-lift shadow-lg">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-10 py-6 hover-lift">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to enhance your reading journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-lift border-2 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookMarked className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Discover Books</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Explore a curated collection of books across all genres. Our smart recommendation system helps you find your perfect next read.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Share Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Write thoughtful reviews and help fellow readers discover amazing books. Your insights matter to our growing community.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift border-2 hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Connect & Grow</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Join a passionate community of readers. Follow your favorite reviewers and discover trending books together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 animate-gradient border-primary/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            <CardContent className="relative p-16 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Join thousands of passionate readers sharing their literary adventures on TurnThePage. Your next favorite book is waiting to be discovered.
              </p>
              {user ? (
                <Link to="/home">
                  <Button size="lg" className="text-xl px-12 py-6 hover-lift shadow-lg">
                    <ArrowRight className="mr-2 h-6 w-6" />
                    Visit Your Library
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button size="lg" className="text-xl px-12 py-6 hover-lift shadow-lg">
                    Start Reading Today
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Landing
