import React, { useState, useEffect } from 'react'
import { Search, Users, UserPlus } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from '../hooks/use-toast'
import * as userApi from '../api/users'
import * as socialApi from '../api/social'

interface UserSearchResult {
    _id: string
    name: string
    username?: string
    profilePicture?: {
        url: string
    }
    bio?: string
    socialStats: {
        followersCount: number
        followingCount: number
        booksAddedCount: number
        reviewsCount: number
    }
    location?: string
    isFollowedByCurrentUser?: boolean
    followStatus?: {
        status: 'none' | 'pending' | 'accepted' | 'self'
        isFollowing: boolean
        isPending: boolean
    }
}

const UsersSearchPage: React.FC = () => {
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
    const [suggestedUsers, setSuggestedUsers] = useState<UserSearchResult[]>([])
    const [loading, setLoading] = useState(false)
    const [suggestionsLoading, setSuggestionsLoading] = useState(true)

    useEffect(() => {
        fetchSuggestedUsers()
    }, [])

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchQuery.trim()) {
                handleSearch()
            } else {
                setSearchResults([])
            }
        }, 300)

        return () => clearTimeout(delayedSearch)
    }, [searchQuery])

    const fetchSuggestedUsers = async () => {
        try {
            const response = await userApi.getSuggestedUsers(20)
            if (response.success) {
                setSuggestedUsers(response.data.users)
            }
        } catch (error) {
            console.error('Error fetching suggested users:', error)
        } finally {
            setSuggestionsLoading(false)
        }
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        setLoading(true)
        try {
            const response = await userApi.searchUsers(searchQuery, 1, 20)
            if (response.success) {
                setSearchResults(response.data.users)
            }
        } catch (error) {
            console.error('Error searching users:', error)
            toast({
                title: "Error",
                description: "Failed to search users",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleFollow = async (userId: string, user: UserSearchResult) => {
        try {
            const isCurrentlyFollowing = user.followStatus?.isFollowing || user.isFollowedByCurrentUser

            if (isCurrentlyFollowing) {
                await socialApi.unfollowUser(userId)
                toast({
                    title: "Unfollowed",
                    description: "You have unfollowed this user"
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
                        description: "You are now following this user"
                    })
                }
            }

            // Refresh the follow status for this user
            const statusResponse = await socialApi.getFollowStatus(userId)
            const newFollowStatus = statusResponse.data

            // Update the local state
            const updateUsersList = (users: UserSearchResult[]) =>
                users.map(u =>
                    u._id === userId
                        ? {
                            ...u,
                            followStatus: newFollowStatus,
                            isFollowedByCurrentUser: newFollowStatus.isFollowing
                        }
                        : u
                )

            setSearchResults(updateUsersList)
            setSuggestedUsers(updateUsersList)

        } catch (error) {
            console.error('Error toggling follow:', error)
            toast({
                title: "Error",
                description: "Failed to update follow status",
                variant: "destructive"
            })
        }
    }

    const renderUserCard = (user: UserSearchResult) => (
        <Card key={user._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                    <Avatar
                        className="h-12 w-12 cursor-pointer"
                        onClick={() => navigate(`/users/${user._id}`)}
                    >
                        <AvatarImage src={user.profilePicture?.url} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <h3
                            className="font-semibold cursor-pointer hover:underline"
                            onClick={() => navigate(`/users/${user._id}`)}
                        >
                            {user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">@{user.username || 'user'}</p>
                        {user.bio && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
                        )}
                        {user.location && (
                            <p className="text-xs text-muted-foreground mt-1">{user.location}</p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                            <span>{user.socialStats.followersCount} followers</span>
                            <span>{user.socialStats.booksAddedCount} books</span>
                            <span>{user.socialStats.reviewsCount} reviews</span>
                        </div>
                    </div>

                    {currentUser?._id !== user._id && (
                        <Button
                            variant={user.followStatus?.isFollowing || user.isFollowedByCurrentUser ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleFollow(user._id, user)}
                            disabled={user.followStatus?.isPending}
                        >
                            <UserPlus className="h-4 w-4 mr-1" />
                            {user.followStatus?.isPending ? 'Requested' :
                                user.followStatus?.isFollowing || user.isFollowedByCurrentUser ? 'Unfollow' : 'Follow'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Discover Users</h1>

                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search for users by name, username, or bio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Search Results */}
                {searchQuery && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                        {loading ? (
                            <div className="grid gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid gap-4">
                                {searchResults.map(renderUserCard)}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">No users found</h3>
                                    <p className="text-muted-foreground">
                                        Try searching with different keywords or check the spelling.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Suggested Users */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Suggested Users</h2>
                    {suggestionsLoading ? (
                        <div className="grid gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-20 bg-gray-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : suggestedUsers.length > 0 ? (
                        <div className="grid gap-4">
                            {suggestedUsers.map(renderUserCard)}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold mb-2">No suggestions available</h3>
                                <p className="text-muted-foreground">
                                    Check back later for user suggestions.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UsersSearchPage
