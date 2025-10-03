import React, { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Plus, Users, BookOpen, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Textarea } from '../components/ui/textarea'
import { useAuth } from '../hooks/useAuth'
import { toast } from '../hooks/use-toast'

interface Activity {
    _id: string
    user: {
        _id: string
        name: string
        username: string
        profilePicture?: {
            url: string
        }
    } | null
    type: 'book_added' | 'book_reviewed' | 'book_liked' | 'user_followed' | 'profile_updated'
    title: string
    description: string
    relatedBook?: {
        _id: string
        title: string
        author: string
        coverImage?: {
            url: string
        }
    }
    relatedUser?: {
        _id: string
        name: string
        username: string
        profilePicture?: {
            url: string
        }
    }
    metadata: {
        rating?: number
        bookTitle?: string
        userName?: string
    }
    likes: any[]
    comments: {
        _id: string
        user: {
            _id: string
            name: string
            username: string
            profilePicture?: {
                url: string
            }
        } | null
        content: string
        createdAt: string
    }[]
    isLikedByUser: boolean
    likesCount: number
    commentsCount: number
    createdAt: string
}

const Dashboard: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({})
    const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({})
    const { user, token, loading: authLoading } = useAuth()
    const navigate = useNavigate()

    // Fetch feed activities - changed to public activities to show all activities
    const fetchActivities = async (pageNum = 1) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/activities/public?page=${pageNum}&limit=10`, {
                headers: token ? {
                    'Authorization': `Bearer ${token}`
                } : {}
            })
            const data = await response.json()
            if (data.success) {
                if (pageNum === 1) {
                    setActivities(data.data.activities)
                } else {
                    setActivities(prev => [...prev, ...data.data.activities])
                }
                setHasMore(data.data.pagination.hasNext)
            }
        } catch (error) {
            console.error('Error fetching activities:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities()
    }, [])

    // Toggle like on activity
    const toggleLike = async (activityId: string) => {
        if (!user || !token) {
            toast({
                title: "Please log in to like posts",
                variant: "destructive"
            })
            return
        }

        // Find the current activity to get current like status
        const currentActivity = activities.find(activity => activity._id === activityId)
        if (!currentActivity) return

        // Optimistic update - immediately update the UI
        const wasLiked = currentActivity.isLikedByUser
        setActivities(prev => prev.map(activity =>
            activity._id === activityId
                ? {
                    ...activity,
                    isLikedByUser: !wasLiked,
                    likesCount: wasLiked ? activity.likesCount - 1 : activity.likesCount + 1
                }
                : activity
        ))

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/activities/${activityId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()

            if (data.success) {
                // Update with actual server response to ensure consistency
                setActivities(prev => prev.map(activity =>
                    activity._id === activityId
                        ? {
                            ...activity,
                            isLikedByUser: data.data.isLiked,
                            likesCount: data.data.likesCount
                        }
                        : activity
                ))

                // Show success toast
                toast({
                    title: data.data.isLiked ? "Post liked!" : "Like removed",
                    description: data.data.isLiked ? "You liked this post" : "You unliked this post"
                })
            } else {
                // Revert optimistic update if server request failed
                setActivities(prev => prev.map(activity =>
                    activity._id === activityId
                        ? {
                            ...activity,
                            isLikedByUser: wasLiked,
                            likesCount: wasLiked ? activity.likesCount + 1 : activity.likesCount - 1
                        }
                        : activity
                ))
                toast({
                    title: "Error",
                    description: "Failed to update like status",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error('Error toggling like:', error)

            // Revert optimistic update on error
            setActivities(prev => prev.map(activity =>
                activity._id === activityId
                    ? {
                        ...activity,
                        isLikedByUser: wasLiked,
                        likesCount: wasLiked ? activity.likesCount + 1 : activity.likesCount - 1
                    }
                    : activity
            ))

            toast({
                title: "Error",
                description: "Failed to update like status. Please try again.",
                variant: "destructive"
            })
        }
    }

    // Add comment to activity
    const addComment = async (activityId: string) => {
        if (!user || !token) {
            toast({
                title: "Please log in to comment",
                variant: "destructive"
            })
            return
        }

        const content = commentTexts[activityId]?.trim()
        if (!content) {
            toast({
                title: "Comment cannot be empty",
                variant: "destructive"
            })
            return
        }

        if (content.length > 500) {
            toast({
                title: "Comment is too long",
                description: "Comments must be 500 characters or less",
                variant: "destructive"
            })
            return
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/activities/${activityId}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            })
            const data = await response.json()

            if (data.success) {
                setActivities(prev => prev.map(activity =>
                    activity._id === activityId
                        ? {
                            ...activity,
                            comments: [...activity.comments, data.data.comment],
                            commentsCount: data.data.commentsCount
                        }
                        : activity
                ))
                setCommentTexts(prev => ({ ...prev, [activityId]: '' }))
                toast({
                    title: "Comment added successfully"
                })
            } else {
                toast({
                    title: "Error adding comment",
                    description: data.message || "Failed to add comment",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error('Error adding comment:', error)
            toast({
                title: "Error adding comment",
                description: "Please try again later",
                variant: "destructive"
            })
        }
    }

    // Get activity type icon and color
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'book_added':
                return { icon: <Plus className="h-4 w-4" />, color: 'bg-green-500' }
            case 'book_reviewed':
                return { icon: <Star className="h-4 w-4" />, color: 'bg-yellow-500' }
            case 'book_liked':
                return { icon: <Heart className="h-4 w-4" />, color: 'bg-red-500' }
            case 'user_followed':
                return { icon: <Users className="h-4 w-4" />, color: 'bg-blue-500' }
            default:
                return { icon: <BookOpen className="h-4 w-4" />, color: 'bg-gray-500' }
        }
    }

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
        return date.toLocaleDateString()
    }

    if (loading || authLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                    <div className="h-64 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Activity Feed */}
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Your Feed</h1>

                {activities.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Follow other users to see their book activities in your feed!
                            </p>
                            <Button onClick={() => navigate('/users/search')}>Discover Users</Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {activities.map((activity) => {
                            // Skip activities where user is null (deleted users)
                            if (!activity.user) {
                                return null
                            }

                            const { icon, color } = getActivityIcon(activity.type)
                            return (
                                <Card key={activity._id} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start space-x-3">
                                            <Avatar
                                                className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                                                onClick={() => navigate(`/users/${activity.user._id}`)}
                                            >
                                                <AvatarImage src={activity.user.profilePicture?.url} />
                                                <AvatarFallback>{activity.user.name?.charAt(0) || 'U'}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span
                                                        className="font-semibold cursor-pointer hover:underline"
                                                        onClick={() => navigate(`/users/${activity.user._id}`)}
                                                    >
                                                        {activity.user.name || 'Unknown User'}
                                                    </span>
                                                    <span
                                                        className="text-sm text-muted-foreground cursor-pointer hover:underline"
                                                        onClick={() => navigate(`/users/${activity.user._id}`)}
                                                    >
                                                        @{activity.user.username || 'user'}
                                                    </span>
                                                    <div className={`${color} p-1 rounded-full text-white`}>
                                                        {icon}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatTimeAgo(activity.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-1">{activity.title}</h4>
                                            <p className="text-muted-foreground">{activity.description}</p>

                                            {/* Show related book if exists */}
                                            {activity.relatedBook && (
                                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center space-x-4 hover:shadow-md transition-shadow cursor-pointer"
                                                    onClick={() => navigate(`/books/${activity.relatedBook?._id}`)}>
                                                    {activity.relatedBook.coverImage?.url && (
                                                        <img
                                                            src={activity.relatedBook.coverImage.url}
                                                            alt={activity.relatedBook.title}
                                                            className="w-16 h-20 object-cover rounded-lg shadow-md"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-foreground hover:text-blue-600 transition-colors">
                                                            {activity.relatedBook.title}
                                                        </h5>
                                                        <p className="text-sm text-muted-foreground mb-2">by {activity.relatedBook.author}</p>
                                                        {activity.metadata.rating && (
                                                            <div className="flex items-center">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < activity.metadata.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                                    />
                                                                ))}
                                                                <span className="ml-2 text-sm font-medium text-yellow-600">{activity.metadata.rating}/5</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-blue-500">
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center space-x-1 text-sm border-t border-muted pt-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleLike(activity._id)}
                                                className={`transition-all duration-200 hover:scale-105 ${activity.isLikedByUser
                                                        ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                        : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
                                                    }`}
                                            >
                                                <Heart className={`h-4 w-4 mr-1 transition-all duration-200 ${activity.isLikedByUser ? 'fill-current scale-110' : ''
                                                    }`} />
                                                {activity.likesCount}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowComments(prev => ({
                                                    ...prev,
                                                    [activity._id]: !prev[activity._id]
                                                }))}
                                                className={`transition-all duration-200 hover:scale-105 ${showComments[activity._id]
                                                        ? 'text-blue-500 bg-blue-50 hover:bg-blue-100'
                                                        : 'text-muted-foreground hover:text-blue-500 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <MessageCircle className="h-4 w-4 mr-1 transition-all duration-200" />
                                                {activity.commentsCount}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-muted-foreground hover:text-green-500 hover:bg-green-50 transition-all duration-200 hover:scale-105"
                                                onClick={() => {
                                                    // Copy post URL to clipboard
                                                    navigator.clipboard.writeText(`${window.location.origin}/activities/${activity._id}`)
                                                    toast({
                                                        title: "Link copied!",
                                                        description: "Post link copied to clipboard"
                                                    })
                                                }}
                                            >
                                                <Share2 className="h-4 w-4 mr-1 transition-all duration-200" />
                                                Share
                                            </Button>
                                        </div>

                                        {/* Comments section */}
                                        {showComments[activity._id] && (
                                            <div className="mt-4 space-y-3 border-t border-muted pt-3">
                                                {activity.comments.length === 0 ? (
                                                    <div className="text-center py-4 text-muted-foreground">
                                                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">No comments yet. Be the first to comment!</p>
                                                    </div>
                                                ) : (
                                                    activity.comments.map((comment) => {
                                                        // Skip comments where user is null (deleted users)
                                                        if (!comment.user) {
                                                            return null
                                                        }

                                                        return (
                                                            <div key={comment._id} className="flex space-x-2">
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarImage src={comment.user.profilePicture?.url} />
                                                                    <AvatarFallback className="text-xs">{comment.user.name?.charAt(0) || 'U'}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <div className="bg-muted p-2 rounded-lg">
                                                                        <span className="font-medium text-sm">{comment.user.name || 'Unknown User'}</span>
                                                                        <p className="text-sm">{comment.content}</p>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        {formatTimeAgo(comment.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                )}

                                                {/* Add comment */}
                                                {user && (
                                                    <div className="flex space-x-2 pt-2 border-t border-muted">
                                                        <Avatar className="h-8 w-8 mt-2">
                                                            <AvatarImage src={user.profilePicture?.url} />
                                                            <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="relative">
                                                                <Textarea
                                                                    placeholder="Write a comment..."
                                                                    value={commentTexts[activity._id] || ''}
                                                                    onChange={(e) => setCommentTexts(prev => ({
                                                                        ...prev,
                                                                        [activity._id]: e.target.value
                                                                    }))}
                                                                    className="min-h-[60px] pr-16 resize-none"
                                                                    maxLength={500}
                                                                />
                                                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                                                    {(commentTexts[activity._id] || '').length}/500
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center mt-2">
                                                                <div className="text-xs text-muted-foreground">
                                                                    {commentTexts[activity._id]?.length > 400 &&
                                                                        `${500 - (commentTexts[activity._id]?.length || 0)} characters remaining`
                                                                    }
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => addComment(activity._id)}
                                                                    disabled={!commentTexts[activity._id]?.trim() || (commentTexts[activity._id]?.length || 0) > 500}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                >
                                                                    Post Comment
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {/* Load more button */}
                        {hasMore && (
                            <div className="text-center">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const nextPage = page + 1
                                        setPage(nextPage)
                                        fetchActivities(nextPage)
                                    }}
                                >
                                    Load More
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard
