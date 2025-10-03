import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface PublicRouteProps {
    children: React.ReactNode
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        )
    }

    if (user) {
        return <Navigate to="/home" replace />
    }

    return <>{children}</>
}
