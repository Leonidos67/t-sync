import { useLocation } from "react-router-dom";
import useAuth from "@/hooks/api/use-auth";
import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { getAutoLoginSuccess, clearAutoLoginSuccess } from "@/lib/aurora-storage";
import { useEffect } from "react";

interface VoltAuthGuardProps {
  children: React.ReactNode;
}

const VoltAuthGuard: React.FC<VoltAuthGuardProps> = ({ children }) => {
  const { data: authData, isLoading } = useAuth();
  const user = authData?.user;
  const location = useLocation();

  console.log('VoltAuthGuard - isLoading:', isLoading);
  console.log('VoltAuthGuard - user:', user);
  console.log('VoltAuthGuard - location:', location.pathname);

  // Очищаем флаг успешного автоматического входа после первого рендера
  useEffect(() => {
    if (getAutoLoginSuccess()) {
      console.log('VoltAuthGuard - clearing auto login success flag');
      clearAutoLoginSuccess();
    }
  }, []);

  // Показываем скелетон только если есть активный запрос
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Volt теперь работает без обязательной авторизации
  // Пользователи могут просматривать контент как гости
  console.log('VoltAuthGuard - rendering children (no redirect)');
  return <>{children}</>;
};

export default VoltAuthGuard;
