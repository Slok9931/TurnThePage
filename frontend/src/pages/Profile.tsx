import { useState, useEffect } from 'react'
import { User, BookOpen, Star, Users, UserPlus, UserCheck, UserX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Button } from '../components/ui/button'
import { BookCard } from '../components/BookCard'
import { ReviewCard } from '../components/ReviewCard'
import { booksApi } from '../api/books'
import { reviewsApi } from '../api/reviews'
import { getFollowers, getFollowing, getPendingRequests, acceptFollowRequest, declineFollowRequest } from '../api/social'
import { useAuth } from '../hooks/useAuth'
import type { Book, Review } from '../types'
import { toast } from 'sonner'

interface FollowUser {
  _id: string
  name: string
  username?: string
  profilePicture?: {
    url: string
  }
  isFollowedByCurrentUser?: boolean
}

const Profile = () => {
  const { user } = useAuth()
  const [myBooks, setMyBooks] = useState<Book[]>([])
  const [myReviews, setMyReviews] = useState<Review[]>([])
  const [followers, setFollowers] = useState<FollowUser[]>([])
  const [following, setFollowing] = useState<FollowUser[]>([])
  const [followRequests, setFollowRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      if (!user?._id) return

      const [booksData, reviewsData, followersData, followingData, requestsData] = await Promise.all([
        booksApi.getMyBooks(),
        reviewsApi.getMyReviews(),
        getFollowers(user._id),
        getFollowing(user._id),
        getPendingRequests(),
      ])
      setMyBooks(booksData)
      setMyReviews(reviewsData)
      setFollowers(followersData.data.followers)
      setFollowing(followingData.data.following)
      setFollowRequests(requestsData.data.requests)
    } catch (error) {
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (followId: string) => {
    try {
      await acceptFollowRequest(followId)
      toast.success('Follow request accepted')
      fetchUserData() // Refresh data
    } catch (error) {
      toast.error('Failed to accept request')
    }
  }

  const handleDeclineRequest = async (followId: string) => {
    try {
      await declineFollowRequest(followId)
      toast.success('Follow request declined')
      fetchUserData() // Refresh data
    } catch (error) {
      toast.error('Failed to decline request')
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user?.name}</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{followers.length}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <UserPlus className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{following.length}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{myBooks.length}</p>
                  <p className="text-sm text-muted-foreground">Books Added</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Star className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{myReviews.length}</p>
                  <p className="text-sm text-muted-foreground">Reviews Written</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="books">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="books">My Books</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="requests">
              Requests {followRequests.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">{followRequests.length}</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="books" className="space-y-4">
            {myBooks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">You haven't added any books yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myBooks.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="space-y-4">
            {myReviews.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">You haven't written any reviews yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="followers" className="space-y-4">
            {followers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No followers yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {followers.map((follower) => (
                  <Card key={follower._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={follower.profilePicture?.url} />
                          <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{follower.name}</h4>
                          {follower.username && (
                            <p className="text-sm text-muted-foreground">@{follower.username}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="following" className="space-y-4">
            {following.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Not following anyone yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {following.map((followedUser) => (
                  <Card key={followedUser._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={followedUser.profilePicture?.url} />
                          <AvatarFallback>{followedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{followedUser.name}</h4>
                          {followedUser.username && (
                            <p className="text-sm text-muted-foreground">@{followedUser.username}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="requests" className="space-y-4">
            {followRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No pending follow requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {followRequests.map((request) => (
                  <Card key={request._id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={request.follower.profilePicture?.url} />
                            <AvatarFallback>{request.follower.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{request.follower.name}</h4>
                            {request.follower.username && (
                              <p className="text-sm text-muted-foreground">@{request.follower.username}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeclineRequest(request._id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Profile
