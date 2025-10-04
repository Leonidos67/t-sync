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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Если пользователь не авторизован, перенаправляем на главную страницу (страницу входа)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
