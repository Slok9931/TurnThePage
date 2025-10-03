import { useState, useEffect } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area,
    ResponsiveContainer
} from 'recharts'
import { TrendingUp, Users, Star, Calendar, Activity, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { analyticsApi, type BookAnalytics } from '../api/analytics'

interface BookAnalyticsProps {
    bookId: string
}

// Color palette matching the website's aesthetic
const COLORS = [
    'hsl(0, 84.2%, 60.2%)',     // Red (destructive) - 1 star
    'hsl(25, 95%, 53%)',       // Orange - 2 stars  
    'hsl(38, 92%, 50%)',       // Primary yellow - 3 stars
    'hsl(142, 76%, 36%)',      // Green - 4 stars
    'hsl(240, 80%, 60%)'       // Accent blue/purple - 5 stars
]

const CHART_COLORS = {
    primary: 'hsl(38, 92%, 50%)',           // Primary yellow/gold
    secondary: 'hsl(240, 60%, 25%)',       // Secondary dark blue
    accent: 'hsl(240, 80%, 60%)',          // Accent blue/purple
    success: 'hsl(142, 76%, 36%)',         // Green
    warning: 'hsl(25, 95%, 53%)',          // Orange
    danger: 'hsl(0, 84.2%, 60.2%)',       // Red
    muted: 'hsl(240, 20%, 45%)',          // Muted foreground
    // Additional harmonious colors for variety
    purple: 'hsl(280, 100%, 70%)',        // Light purple
    teal: 'hsl(180, 100%, 35%)',          // Teal
    indigo: 'hsl(230, 100%, 65%)',        // Indigo
    pink: 'hsl(330, 100%, 70%)',          // Pink
}

const BookAnalyticsComponent = ({ bookId }: BookAnalyticsProps) => {
    const [analytics, setAnalytics] = useState<BookAnalytics | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true)
                const data = await analyticsApi.getBookAnalytics(bookId)
                setAnalytics(data)
                setError(null)
            } catch (err) {
                setError('Failed to load analytics data')
                console.error('Analytics error:', err)
            } finally {
                setLoading(false)
            }
        }

        if (bookId) {
            fetchAnalytics()
        }
    }, [bookId])

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="h-16 bg-muted animate-pulse rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="h-64 bg-muted animate-pulse rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error || !analytics) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">{error || 'No analytics data available'}</p>
                </CardContent>
            </Card>
        )
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Reviews</p>
                                <p className="text-2xl font-bold">{analytics.overview.totalReviews}</p>
                            </div>
                            <Users className="h-8 w-8" style={{ color: CHART_COLORS.primary }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Average Rating</p>
                                <p className="text-2xl font-bold flex items-center gap-1">
                                    {analytics.overview.averageRating}
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8" style={{ color: CHART_COLORS.success }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                                <p className="text-2xl font-bold">{analytics.overview.highestRated}</p>
                            </div>
                            <Star className="h-8 w-8" style={{ color: CHART_COLORS.warning }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Week</p>
                                <p className="text-2xl font-bold">{analytics.overview.reviewsThisWeek}</p>
                            </div>
                            <Calendar className="h-8 w-8" style={{ color: CHART_COLORS.accent }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">1-Star Reviews</p>
                                <p className="text-2xl font-bold">{analytics.overview.lowestRated}</p>
                            </div>
                            <Activity className="h-8 w-8" style={{ color: CHART_COLORS.danger }} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rating Distribution Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" style={{ color: CHART_COLORS.primary }} />
                            Rating Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.ratingDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={90}
                                    innerRadius={30}
                                    fill="#8884d8"
                                    dataKey="count"
                                    label={({ percentage }) => `${percentage}%`}
                                    labelLine={false}
                                >
                                    {analytics.ratingDistribution.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="rgba(255,255,255,0.6)"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Reviews Over Time */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" style={{ color: CHART_COLORS.success }} />
                            Reviews Over Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.reviewsOverTime}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={formatMonth}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    labelFormatter={formatMonth}
                                />
                                <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Rating Trend Over Time */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5" style={{ color: CHART_COLORS.warning }} />
                            Average Rating Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.ratingOverTime}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="averageRating"
                                    stroke={CHART_COLORS.success}
                                    strokeWidth={3}
                                    dot={{ fill: CHART_COLORS.success, strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Daily Activity (Last 7 Days) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" style={{ color: CHART_COLORS.accent }} />
                            Daily Activity (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={analytics.dailyActivity}>
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="reviews"
                                    stroke={CHART_COLORS.accent}
                                    fill="url(#areaGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Reviewers */}
            {analytics.topReviewers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" style={{ color: CHART_COLORS.secondary }} />
                            Top Reviewers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topReviewers.map((reviewer, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium">{reviewer.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {reviewer.reviewCount} review{reviewer.reviewCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        {reviewer.averageRating.toFixed(1)}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default BookAnalyticsComponent
