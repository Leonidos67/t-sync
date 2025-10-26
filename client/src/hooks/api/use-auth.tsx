import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: false, // Отключаем повторные попытки для неавторизованных пользователей
    refetchOnWindowFocus: false, // Отключаем автоматическую перезагрузку при фокусе окна
    refetchOnMount: true, // Включаем автоматическую перезагрузку при монтировании
    refetchOnReconnect: false, // Отключаем автоматическую перезагрузку при переподключении
    enabled: true, // Включаем автоматические запросы
  });

  console.log('🔑 useAuth - Query state:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    data: query.data,
    error: query.error,
    status: query.status
  });

  return query;
};

export default useAuth;