import useWorkspaceId from "@/hooks/use-workspace-id";
import AnalyticsCard from "./common/analytics-card";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalyticsQueryFn } from "@/lib/api";

const WorkspaceAnalytics = () => {
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
    refetchOnMount: true,
  });

  const analytics = data?.analytics;

  return (
    <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-4">
      <AnalyticsCard
        isLoading={isPending}
        title="Все тренировки"
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Актуальные"
        value={Math.max(
          0,
          (analytics?.totalTasks || 0) - (analytics?.completedTasks || 0) - (analytics?.overdueTasks || 0)
        )}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Просроченные"
        value={analytics?.overdueTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title="Выполненные"
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};

export default WorkspaceAnalytics;
