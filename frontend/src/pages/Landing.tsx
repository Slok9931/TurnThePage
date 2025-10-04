import { Link } from 'react-router-dom'
import {
  BookOpen,
  Star,
  Users,
  BookMarked,
  ArrowRight,
  Heart,
  MessageCircle,
  Search,
  Upload,
  Camera,
  UserPlus,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Award
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

const Landing = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-primary/5 to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]" />
        <div className="container relative">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium shadow-lg">
              <BookOpen className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-primary">The Ultimate Book Community Platform</span>
              <Badge className="ml-2 bg-gradient-to-r from-primary to-secondary">New</Badge>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold tracking-tight">
              <span className="text-secondary">
                Turn Every Page
              </span>
              <br />
              <span className="text-primary">
                Into Adventure
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join the ultimate social platform for book lovers. Discover new books, share reviews, connect with fellow readers, and build your digital library with our comprehensive book management system.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <span>10K+ Active Readers</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>50K+ Books Reviewed</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-accent" />
                <span>100K+ Likes Shared</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              {user ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                    <Activity className="mr-2 h-5 w-5" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Start Your Journey Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-12 py-6 border-2 border-primary hover:border-secondary hover:bg-primary/5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                      <Users className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary">Core Features</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Everything You Need to Love Reading
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              A comprehensive platform designed to transform how you discover, share, and enjoy books
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Book Management */}
            <Card className="group hover:shadow-2xl border-0 shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader className="pb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BookMarked className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">Smart Book Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Add books with cover images, organize your library, and track your reading progress with our intuitive book management system.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Upload className="h-3 w-3 mr-1" />
                    Image Upload
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Digital Library
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Social Features */}
            <Card className="group hover:shadow-2xl border-0 shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardHeader className="pb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">Social Reading Network</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Follow friends, discover new readers, and build meaningful connections through shared literary interests and reading experiences.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Follow System
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    Privacy Controls
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Reviews & Ratings */}
            <Card className="group hover:shadow-2xl border-0 shadow-lg hover:scale-105 transition-all duration-300 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardHeader className="pb-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Star className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Share detailed reviews, rate books with our 5-star system, and help the community discover their next favorite read.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    <Star className="h-3 w-3 mr-1" />
                    5-Star Rating
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    <Award className="h-3 w-3 mr-1" />
                    Featured Reviews
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-secondary to-primary">Interactive Features</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Engage & Connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Rich interaction features that bring the reading community together
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Activity Feed */}
            <Card className="group hover:shadow-xl border-0 shadow-md hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardHeader className="text-center pb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Stay updated with real-time activities from your friends and favorite readers
                </p>
              </CardContent>
            </Card>

            {/* Like System */}
            <Card className="group hover:shadow-xl border-0 shadow-md hover:scale-105 transition-all duration-300 bg-gradient-to-br from-red-50 to-pink-50">
              <CardHeader className="text-center pb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Like System</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Express appreciation with our one-click like system for posts and reviews
                </p>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="group hover:shadow-xl border-0 shadow-md hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader className="text-center pb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">Comments</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Engage in meaningful discussions about books with the community
                </p>
              </CardContent>
            </Card>

            {/* Discovery */}
            <Card className="group hover:shadow-xl border-0 shadow-md hover:scale-105 transition-all duration-300 bg-gradient-to-br from-secondary/10 to-primary/10">
              <CardHeader className="text-center pb-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">User Discovery</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Find and connect with readers who share your literary interests
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-secondary to-primary">Advanced Features</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Professional Reading Tools
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center flex-shrink-0">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Image Upload & Management</h3>
                  <p className="text-muted-foreground">Upload book covers and profile pictures with our integrated Cloudinary system. Professional image handling with automatic optimization.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">Track your reading progress, review statistics, and social engagement with comprehensive analytics and insights.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
                  <p className="text-muted-foreground">Instant notifications for likes, comments, follows, and new book releases. Stay connected with the community in real-time.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Global Community</h3>
                  <p className="text-muted-foreground">Connect with readers worldwide. Share cultural perspectives and discover international literature through our global platform.</p>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <Card className="bg-gradient-to-br from-secondary to-primary border-0 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10" />
                <CardContent className="relative p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-8 w-8 text-white" />
                      <span className="text-2xl font-bold">TurnThePage Pro</span>
                    </div>
                    <p className="text-lg opacity-90">
                      Unlock premium features including advanced analytics, unlimited uploads, priority support, and exclusive community access.
                    </p>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">∞</div>
                        <div className="text-sm opacity-80">Book Uploads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">24/7</div>
                        <div className="text-sm opacity-80">Support</div>
                      </div>
                    </div>
                    <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-secondary via-primary to-secondary">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Join the Reading Revolution</h2>
            <p className="text-xl opacity-90 mb-12 max-w-3xl mx-auto">
              Be part of a thriving community that's redefining how we discover and share great literature
            </p>

            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold mb-2">10K+</div>
                <div className="text-lg opacity-90">Active Readers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold mb-2">50K+</div>
                <div className="text-lg opacity-90">Books Added</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold mb-2">75K+</div>
                <div className="text-lg opacity-90">Reviews Written</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-6xl font-bold mb-2">100K+</div>
                <div className="text-lg opacity-90">Community Interactions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Why Choose TurnThePage?
              </h2>
              <p className="text-xl text-gray-600">
                The most comprehensive book community platform ever built
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Complete Book Management</h3>
                    <p className="text-gray-600">Add books with cover images, organize your library, and track your reading journey all in one place.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Social Reading Network</h3>
                    <p className="text-gray-600">Follow readers, build connections, and discover books through your personal social network.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Rich Review System</h3>
                    <p className="text-gray-600">Write detailed reviews, rate books, and help others discover their next great read.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Interactive Engagement</h3>
                    <p className="text-gray-600">Like posts, comment on reviews, and engage with the community through our rich interaction system.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Search className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Smart Discovery</h3>
                    <p className="text-gray-600">Find new books and readers with our intelligent search and recommendation system.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Privacy Controls</h3>
                    <p className="text-gray-600">Control who sees your activity with comprehensive privacy settings and follow request systems.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Reading Experience?
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join TurnThePage today and become part of the most vibrant book community on the internet.
              Your literary adventure starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              {user ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/dashboard">
                    <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl">
                      <Activity className="mr-2 h-5 w-5" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/users/search">
                    <Button size="lg" variant="outline" className="text-lg px-12 py-6 border-gray-400 text-black">
                      <Search className="mr-2 h-5 w-5" />
                      Discover Readers
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Start Your Journey Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="text-lg px-12 py-6 border-gray-400 text-white hover:bg-white hover:text-gray-900">
                      <Users className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-8 text-sm text-gray-400">
              <p>✨ Free forever • No credit card required • Join 10,000+ readers today</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
