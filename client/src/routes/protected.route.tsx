import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { useAuthContext } from "@/context/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, isLoading, isFetching } = useAuthContext();

  console.log('🛡️ ProtectedRoute - isLoading:', isLoading, 'isFetching:', isFetching, 'user:', user);

  // While the auth query is loading or refetching on first mount, show skeleton
  if (isLoading || isFetching) {
    console.log('🛡️ ProtectedRoute - Loading, showing skeleton');
    return <DashboardSkeleton />;
  }

  // If, after fetching, there is still no user, send to login
  if (!user) {
    console.log('🛡️ ProtectedRoute - No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('🛡️ ProtectedRoute - User authenticated, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;
