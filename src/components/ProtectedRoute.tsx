import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function ProtectedRoute({ requiredRole, allowedRoles, redirectTo = '/admin' }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não houver sessão, vai para o login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Verificação por role única (ex: super-admin)
  if (requiredRole && profile && profile.role !== requiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verificação por lista de roles permitidas (ex: ['admin', 'super-admin'])
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
