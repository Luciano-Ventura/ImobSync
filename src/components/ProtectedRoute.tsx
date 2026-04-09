import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();

  // Enquanto está carregando o estado de auth (sessão), mostramos o spinner
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

  // Se houver uma role obrigatória e o perfil carregou, checamos
  // Nota: Não bloqueamos o acesso se o perfil ainda estiver carregando (profile === null)
  // para evitar o problema de loading infinito.
  if (requiredRole && profile && profile.role !== requiredRole) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
