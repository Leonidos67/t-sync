import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/api/use-auth";
import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;

  console.log('🔐 AuthGuard - isLoading:', isLoading, 'user:', user);

  if (isLoading) {
    console.log('🔐 AuthGuard - Loading, showing skeleton');
    return <DashboardSkeleton />;
  }

  // Если пользователь не авторизован, перенаправляем на главную страницу (страницу входа)
  if (!user) {
    console.log('🔐 AuthGuard - No user, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('🔐 AuthGuard - User authenticated, rendering children');
  return <>{children}</>;
};

export default AuthGuard;
