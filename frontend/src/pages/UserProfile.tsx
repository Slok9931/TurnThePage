import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Users,
    BookOpen,
    Star,
    Calendar,
    MapPin,
    Link,
    UserPlus,
    UserMinus,
    UserCheck,
    Settings
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useAuth } from '../hooks/useAuth'
import { toast } from '../hooks/use-toast'
import * as userApi from '../api/users'
import * as socialApi from '../api/social'

interface UserProfile {
    _id: string
    name: string
    username?: string
    email: string
    bio?: string
    profilePicture?: {
        url: string
        publicId: string
    }
    coverPicture?: {
        url: string
        publicId: string
    }
    location?: string
    website?: string
    joinDate: string
    isPrivate: boolean
    favoriteGenres?: string[]
    socialStats: {
        followersCount: number
        followingCount: number
        booksAddedCount: number
        reviewsCount: number
    }
    followStatus?: {
        status: 'none' | 'pending' | 'accepted' | 'self'
        isFollowing: boolean
        isPending: boolean
        isFollowingBack?: boolean
        isMutual?: boolean
        pendingRequestId?: string | null
    }
    recentBooks?: any[]
    recentReviews?: any[]
    stats?: any
}

const UserProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [followLoading, setFollowLoading] = useState(false)
    const [followers, setFollowers] = useState<any[]>([])
    const [following, setFollowing] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (userId) {
            fetchUserProfile()
            if (activeTab === 'followers') fetchFollowers()
            if (activeTab === 'following') fetchFollowing()
        }
    }, [userId, activeTab])

    const fetchUserProfile = async () => {
        try {
            if (!userId) return
            const response = await userApi.getUserProfile(userId)
            if (response.success) {
                setProfile(response.data.user)
            }
        } catch (error) {
            console.error('Error fetching user profile:', error)
            toast({
                title: "Error",
                description: "Failed to load user profile",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchFollowers = async () => {
        try {
            if (!userId) return
            const response = await socialApi.getFollowers(userId)
            if (response.success) {
                setFollowers(response.data.followers)
            }
        } catch (error) {
            console.error('Error fetching followers:', error)
        }
    }

    const fetchFollowing = async () => {
        try {
            if (!userId) return
            const response = await socialApi.getFollowing(userId)
            if (response.success) {
                setFollowing(response.data.following)
            }
        } catch (error) {
            console.error('Error fetching following:', error)
        }
    }

    const handleFollowToggle = async () => {
        if (!profile || !userId || followLoading) return

        setFollowLoading(true)
        try {
            const isCurrentlyFollowing = profile.followStatus?.isFollowing

            if (isCurrentlyFollowing) {
                await socialApi.unfollowUser(userId)
                toast({
                    title: "Unfollowed",
                    description: `You unfollowed ${profile.name}`
                })
            } else {
                const result = await socialApi.followUser(userId)
                if (result.data.follow.status === 'pending') {
                    toast({
                        title: "Follow Request Sent",
                        description: "Your follow request has been sent"
                    })
                } else {
                    toast({
                        title: "Followed",
                        description: `You are now following ${profile.name}`
                    })
                }
            }

            // Get the updated follow status
            const statusResponse = await socialApi.getFollowStatus(userId)
            const newFollowStatus = statusResponse.data

            // Update the profile with the new follow status
            setProfile(prev => prev ? {
                ...prev,
                followStatus: newFollowStatus,
                socialStats: {
                    ...prev.socialStats,
                    followersCount: isCurrentlyFollowing
                        ? prev.socialStats.followersCount - 1
                        : (newFollowStatus.status === 'accepted' ? prev.socialStats.followersCount + 1 : prev.socialStats.followersCount)
                }
            } : null)

        } catch (error) {
            console.error('Error toggling follow:', error)
            toast({
                title: "Error",
                description: "Failed to update follow status",
                variant: "destructive"
            })
        } finally {
            setFollowLoading(false)
        }
    }

    const handleAcceptFollow = async () => {
        if (!profile || !profile.followStatus?.pendingRequestId || followLoading) return

        setFollowLoading(true)
        try {
            await socialApi.acceptFollowRequest(profile.followStatus.pendingRequestId)
            toast({
                title: "Follow request accepted",
                description: `You accepted ${profile.name}'s follow request`
            })

            // Get the updated follow status
            const statusResponse = await socialApi.getFollowStatus(userId!)
            const newFollowStatus = statusResponse.data

            // Update the profile with the new follow status and increment follower count
            setProfile(prev => prev ? {
                ...prev,
                followStatus: newFollowStatus,
                socialStats: {
                    ...prev.socialStats,
                    followersCount: prev.socialStats.followersCount + 1
                }
            } : null)

        } catch (error) {
            console.error('Error accepting follow request:', error)
            toast({
                title: "Error",
                description: "Failed to accept follow request",
                variant: "destructive"
            })
        } finally {
            setFollowLoading(false)
        }
    }

    const formatJoinDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-8 text-center">
                        <h3 className="text-lg font-semibold mb-2">User not found</h3>
                        <p className="text-muted-foreground mb-4">
                            The user you're looking for doesn't exist or has been removed.
                        </p>
                        <Button onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const isOwnProfile = currentUser?._id === profile._id

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Cover Photo */}
            <div className="relative mb-8">
                <div
                    className="h-64 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl bg-cover bg-center shadow-xl"
                    style={profile.coverPicture?.url ? {
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${profile.coverPicture.url})`
                    } : {}}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl"></div>
                    {isOwnProfile && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-4 right-4 z-10 backdrop-blur-sm bg-white/90 hover:bg-white"
                            onClick={() => navigate('/settings/profile')}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    )}
                </div>

                {/* Profile Picture */}
                <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
                            <AvatarImage src={profile.profilePicture?.url} />
                            <AvatarFallback className="text-3xl font-bold">{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {profile.isPrivate && (
                            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-1 border-2 border-background">
                                <Users className="h-3 w-3" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="ml-8 mb-8 pt-8">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold">{profile.name}</h1>
                            {profile.isPrivate && (
                                <Badge variant="outline" className="text-amber-600 border-amber-200">
                                    <Users className="h-3 w-3 mr-1" />
                                    Private
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground text-lg mb-4">@{profile.username || 'user'}</p>

                        {profile.bio && (
                            <div className="mb-6">
                                <p className="text-foreground text-lg leading-relaxed max-w-2xl">{profile.bio}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                            {profile.location && (
                                <div className="flex items-center bg-muted/50 px-3 py-1 rounded-full">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {profile.location}
                                </div>
                            )}
                            {profile.website && (
                                <div className="flex items-center bg-muted/50 px-3 py-1 rounded-full">
                                    <Link className="h-4 w-4 mr-2" />
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {profile.website}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center bg-muted/50 px-3 py-1 rounded-full">
                                <Calendar className="h-4 w-4 mr-2" />
                                Joined {formatJoinDate(profile.joinDate)}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-6">
                            <button
                                className="group hover:bg-muted/50 px-3 py-2 rounded-lg transition-colors"
                                onClick={() => setActiveTab('following')}
                            >
                                <span className="font-bold text-lg text-foreground">{profile.socialStats.followingCount}</span>
                                <span className="text-muted-foreground ml-1 group-hover:text-foreground transition-colors">Following</span>
                            </button>
                            <button
                                className="group hover:bg-muted/50 px-3 py-2 rounded-lg transition-colors"
                                onClick={() => setActiveTab('followers')}
                            >
                                <span className="font-bold text-lg text-foreground">{profile.socialStats.followersCount}</span>
                                <span className="text-muted-foreground ml-1 group-hover:text-foreground transition-colors">Followers</span>
                            </button>
                            <div className="px-3 py-2">
                                <span className="font-bold text-lg text-foreground">{profile.socialStats.booksAddedCount}</span>
                                <span className="text-muted-foreground ml-1">Books</span>
                            </div>
                            <div className="px-3 py-2">
                                <span className="font-bold text-lg text-foreground">{profile.socialStats.reviewsCount}</span>
                                <span className="text-muted-foreground ml-1">Reviews</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        {!isOwnProfile && profile.followStatus?.status !== 'self' && (
                            <>
                                {/* If the target user has sent a follow request to current user, show accept option */}
                                {profile.followStatus?.pendingRequestId && (
                                    <Button
                                        onClick={handleAcceptFollow}
                                        disabled={followLoading}
                                        className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                        size="lg"
                                    >
                                        {followLoading ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Accepting...
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck className="h-4 w-4 mr-2" />
                                                Accept Request
                                            </>
                                        )}
                                    </Button>
                                )}

                                {/* Mutual follow - show both following indicator */}
                                {profile.followStatus?.isMutual ? (
                                    <Button
                                        variant="outline"
                                        disabled
                                        size="lg"
                                        className="bg-blue-50 border-blue-200 text-blue-700 shadow-md"
                                    >
                                        <Users className="h-4 w-4 mr-2" />
                                        Mutual Friends
                                    </Button>
                                ) : (
                                    /* Regular follow/unfollow button */
                                    <Button
                                        variant={profile.followStatus?.isFollowing ? "outline" : "default"}
                                        onClick={handleFollowToggle}
                                        disabled={followLoading || profile.followStatus?.isPending}
                                        size="lg"
                                        className={`shadow-lg hover:shadow-xl transition-all duration-200 ${profile.followStatus?.isFollowing
                                                ? 'hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            } ${profile.followStatus?.isPending
                                                ? 'bg-amber-100 border-amber-300 text-amber-700'
                                                : ''
                                            }`}
                                    >
                                        {followLoading ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                {profile.followStatus?.isFollowing ? 'Unfollowing...' : 'Requesting...'}
                                            </>
                                        ) : profile.followStatus?.isFollowing ? (
                                            <>
                                                <UserMinus className="h-4 w-4 mr-2" />
                                                Unfollow
                                            </>
                                        ) : profile.followStatus?.isPending ? (
                                            <>
                                                <Users className="h-4 w-4 mr-2" />
                                                Requested
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Favorite Genres */}
                {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
                    <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                        <h3 className="text-lg font-semibold mb-3 text-foreground">Favorite Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.favoriteGenres.map((genre) => (
                                <Badge
                                    key={genre}
                                    variant="secondary"
                                    className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 hover:from-blue-200 hover:to-purple-200 transition-colors"
                                >
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-none lg:inline-flex bg-muted/50 p-1 h-auto rounded-xl">
                    <TabsTrigger
                        value="overview"
                        className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    >
                        <BookOpen className="h-4 w-4 mr-2 lg:inline hidden" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="books"
                        className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    >
                        <BookOpen className="h-4 w-4 mr-2 lg:inline hidden" />
                        Books
                    </TabsTrigger>
                    <TabsTrigger
                        value="reviews"
                        className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    >
                        <Star className="h-4 w-4 mr-2 lg:inline hidden" />
                        Reviews
                    </TabsTrigger>
                    <TabsTrigger
                        value="followers"
                        className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    >
                        <Users className="h-4 w-4 mr-2 lg:inline hidden" />
                        Followers
                    </TabsTrigger>
                    <TabsTrigger
                        value="following"
                        className="data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    >
                        <UserPlus className="h-4 w-4 mr-2 lg:inline hidden" />
                        Following
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Books */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2" />
                                    Recent Books Added
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile.recentBooks && profile.recentBooks.length > 0 ? (
                                    <div className="space-y-3">
                                        {profile.recentBooks.map((book) => (
                                            <div key={book._id} className="flex items-center space-x-3">
                                                {book.coverImage?.url && (
                                                    <img
                                                        src={book.coverImage.url}
                                                        alt={book.title}
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{book.title}</h4>
                                                    <p className="text-xs text-muted-foreground">by {book.author}</p>
                                                    {book.averageRating > 0 && (
                                                        <div className="flex items-center mt-1">
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-xs ml-1">{book.averageRating.toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No books added yet.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Star className="h-5 w-5 mr-2" />
                                    Recent Reviews
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {profile.recentReviews && profile.recentReviews.length > 0 ? (
                                    <div className="space-y-3">
                                        {profile.recentReviews.map((review) => (
                                            <div key={review._id} className="border-b pb-3 last:border-b-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{review.rating}/5</span>
                                                </div>
                                                <p className="text-sm font-medium">{review.book?.title}</p>
                                                {review.comment && (
                                                    <p className="text-xs text-muted-foreground mt-1">{review.comment}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No reviews yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="followers" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{profile.socialStats.followersCount} Followers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {followers.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {followers.map((follower) => (
                                        <div key={follower._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                            <Avatar
                                                className="h-10 w-10 cursor-pointer"
                                                onClick={() => navigate(`/users/${follower._id}`)}
                                            >
                                                <AvatarImage src={follower.profilePicture?.url} />
                                                <AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4
                                                    className="font-medium cursor-pointer hover:underline"
                                                    onClick={() => navigate(`/users/${follower._id}`)}
                                                >
                                                    {follower.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">@{follower.username || 'user'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {follower.socialStats?.followersCount || 0} followers
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No followers yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="following" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{profile.socialStats.followingCount} Following</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {following.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {following.map((followedUser) => (
                                        <div key={followedUser._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                            <Avatar
                                                className="h-10 w-10 cursor-pointer"
                                                onClick={() => navigate(`/users/${followedUser._id}`)}
                                            >
                                                <AvatarImage src={followedUser.profilePicture?.url} />
                                                <AvatarFallback>{followedUser.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h4
                                                    className="font-medium cursor-pointer hover:underline"
                                                    onClick={() => navigate(`/users/${followedUser._id}`)}
                                                >
                                                    {followedUser.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">@{followedUser.username || 'user'}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {followedUser.socialStats?.followersCount || 0} followers
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Not following anyone yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="books" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{profile.socialStats.booksAddedCount} Books Added</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Books list will be implemented here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{profile.socialStats.reviewsCount} Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Reviews list will be implemented here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UserProfilePage
