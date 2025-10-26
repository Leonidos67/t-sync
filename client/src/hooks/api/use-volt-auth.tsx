import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useVoltAuth = () => {
  const query = useQuery({
    queryKey: ["voltAuthUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: true, // Включаем запросы для страниц Volt
  });
  
  console.log('useVoltAuth - data:', query.data);
  console.log('useVoltAuth - isLoading:', query.isLoading);
  console.log('useVoltAuth - error:', query.error);
  
  return query;
};

export default useVoltAuth;
