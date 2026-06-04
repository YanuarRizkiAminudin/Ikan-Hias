import { Navigate } from 'react-router-dom'
import { useAdminContext } from '@/context/AdminContext'
import { ROUTES } from '@/lib/constants'
import Spinner from '@/components/ui/Spinner'
import type { ReactNode } from 'react'

interface AdminRouteProps {
  children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { session, profile, loading } = useAdminContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session || !profile) {
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />
  }

  return <>{children}</>
}
