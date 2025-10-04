import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader, Activity as ActivityIcon, Copy, Check } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorkspaceAnalyticsQueryFn, getWorkspaceWeeklyAnalyticsQueryFn, deleteWorkspaceMutationFn, getWorkspaceByIdQueryFn } from "@/lib/api";
import { BASE_ROUTE } from "@/routes/common/routePaths";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AnimatedDelete } from "@/components/ui/motion/AnimatedDelete";
import { useNavigate } from "react-router-dom";
import { AnimatedFolders } from "@/components/ui/motion/AnimatedFolders";
import { AnimatedCloudDownload } from "@/components/ui/motion/CloudDownload";
import { Podcast } from "@/components/ui/motion/Podcast";
import { SmartphoneNfc } from "@/components/ui/motion/SmartphoneNfc";
import { ClipboardCopy } from "@/components/ui/motion/ClipboardCopy";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "@/hooks/use-toast";

// локальный хук для hover-анимаций
const useHoverAnimating = () => {
  const [isHoverAnimating, setIsHoverAnimating] = useState(false);
  const bind = {
    onMouseEnter: () => setIsHoverAnimating(true),
    onMouseLeave: () => setIsHoverAnimating(false),
  } as const;
  return { isHoverAnimating, bind };
};

// локальный стейт для hover-анимации удаления
const useDeleteHover = () => {
  const [isHoverAnimating, setIsHoverAnimating] = useState(false);
  const bind = {
    onMouseEnter: () => setIsHoverAnimating(true),
    onMouseLeave: () => setIsHoverAnimating(false),
  } as const;
  return { isHoverAnimating, bind };
};

interface UserSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    _id: string;
    name: string;
    email?: string;
    profilePicture?: string;
    description?: string;
    joinedAt?: Date;
  } | null;
  workspaceId?: string; // Добавляем опциональный workspaceId
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-card p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 dark:text-foreground">{`${label}`}</p>
        <p className="text-green-600 dark:text-green-400">{`Выполнено: ${payload[0].value}`}</p>
        <p className="text-gray-600 dark:text-white">{`Всего: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

const UserSettingsModal = ({ open, onOpenChange, user, workspaceId: propWorkspaceId }: UserSettingsModalProps) => {
  const isMobile = useIsMobile();
  const urlWorkspaceId = useWorkspaceId();
  const workspaceId = propWorkspaceId || urlWorkspaceId;

  // confirm dialog state for deleting workspace
  const { open: openConfirm, onOpenDialog, onCloseDialog } = useConfirmDialog();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending: isDeletePending } = useMutation({
    mutationFn: deleteWorkspaceMutationFn,
  });

  const handleConfirmDeleteWorkspace = () => {
    mutate(workspaceId, {
      onSuccess: (data: { currentWorkspace: string }) => {
        queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
        onOpenChange(false);
        navigate(`/workspace/${data.currentWorkspace}`);
        setTimeout(() => onCloseDialog(), 100);
      },
      onError: (error: { message?: string }) => {
        toast({
          title: "Уведомление",
          description: error?.message || "Не удалось удалить зону",
          variant: "destructive",
        });
      },
    });
  };

  // Загружаем аналитику рабочего пространства
  const { data: analyticsData, isPending: isAnalyticsPending } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId && open,
    retry: false,
    refetchOnMount: true,
  });

  // Загружаем недельную аналитику для графика
  const { data: weeklyData, isPending: isWeeklyPending } = useQuery({
    queryKey: ["workspace-weekly-analytics", workspaceId],
    queryFn: () => getWorkspaceWeeklyAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId && open,
    retry: false,
    refetchOnMount: true,
  });

  // Загружаем данные рабочего пространства для заголовка
  const { data: workspaceData, isPending: isWorkspacePending } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId && open,
    retry: false,
    refetchOnMount: true,
  });

  // Hover-стейты для иконок
  const { isHoverAnimating: isViewHoverAnimating, bind: viewHoverBind } = useHoverAnimating();
  const { isHoverAnimating: isEditHoverAnimating, bind: editHoverBind } = useHoverAnimating();
  const { isHoverAnimating: isNoteHoverAnimating, bind: noteHoverBind } = useHoverAnimating();
  const { isHoverAnimating: isDownloadHoverAnimating, bind: downloadHoverBind } = useHoverAnimating();
  const { isHoverAnimating: isDeleteHoverAnimating, bind: deleteHoverBind } = useDeleteHover();

  // анимация папки
  const [openFolderAnimating, setOpenFolderAnimating] = useState(false);
  
  // состояние для копирования ссылки приглашения
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  
  // состояние для копирования ID зоны
  const [copiedZoneId, setCopiedZoneId] = useState(false);

  // Принудительно обновляем данные при изменении workspaceId
  useEffect(() => {
    if (open && workspaceId) {
      // Сначала очищаем старые данные
      queryClient.removeQueries({ queryKey: ["workspace-analytics", workspaceId] });
      queryClient.removeQueries({ queryKey: ["workspace-weekly-analytics", workspaceId] });
      queryClient.removeQueries({ queryKey: ["workspace", workspaceId] });
      
      // Затем принудительно обновляем
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-weekly-analytics", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    }
  }, [workspaceId, open, queryClient]);

  // Очищаем данные при закрытии модала
  useEffect(() => {
    if (!open) {
      // Небольшая задержка для плавного закрытия
      const timer = setTimeout(() => {
        if (workspaceId) {
          queryClient.removeQueries({ queryKey: ["workspace-analytics", workspaceId] });
          queryClient.removeQueries({ queryKey: ["workspace-weekly-analytics", workspaceId] });
          queryClient.removeQueries({ queryKey: ["workspace", workspaceId] });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, workspaceId, queryClient]);

  const workspace = workspaceData?.workspace;
  const initials = workspace ? getAvatarFallbackText(workspace.name) : (user ? getAvatarFallbackText(user.name) : "U");
  const avatarColor = workspace ? getAvatarColor(workspace.name) : (user ? getAvatarColor(user.name) : "bg-gray-500");

  const analytics = analyticsData?.analytics;
  const weeklyAnalytics = weeklyData?.weeklyData;

  // Вычисляем актуальные тренировки
  const activeTasks = Math.max(
    0,
    (analytics?.totalTasks || 0) - (analytics?.completedTasks || 0) - (analytics?.overdueTasks || 0)
  );

  // Проверяем, загружаются ли данные
  const isDataLoading = isAnalyticsPending || isWeeklyPending || isWorkspacePending;

  // Проверяем валидность данных
  if (!user || !workspaceId) {
    return null;
  }

  const handleGoToZone = () => {
    navigate(`/workspace/${workspaceId}/home`);
    onOpenChange(false);
  };

  const handleDownloadActivity = () => {
    try {
      const data = { 
        workspaceId: workspaceId, 
        workspaceName: workspace?.name || 'Unknown', 
        exportedAt: new Date().toISOString() 
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workspace-${workspaceId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Уведомление", description: "Не удалось скачать файл" });
    }
  };

  const handleViewData = () => {
    toast({ title: "Уведомление", description: "Скоро будет доступно" });
  };
  const handleEdit = () => {
    toast({ title: "Уведомление", description: "Скоро будет доступно" });
  };
  const handleWriteNote = () => {
    toast({ title: "Уведомление", description: "Скоро будет доступно" });
  };

  // Функция для копирования ссылки приглашения
  const handleCopyInviteLink = () => {
    const inviteCode = workspace?.inviteCode || "";
    if (inviteCode) {
      const inviteUrl = `${window.location.origin}${BASE_ROUTE.INVITE_URL.replace(":inviteCode", inviteCode)}`;
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopiedInviteLink(true);
        toast({
          title: "Уведомление",
          description: "Ссылка приглашения скопирована в буфер обмена",
          variant: "success",
        });
        setTimeout(() => setCopiedInviteLink(false), 2000);
      });
    }
  };

  const contentHeader = (
    <div className="flex items-start gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={user.profilePicture || ""} alt="Avatar" />
        <AvatarFallback className={`${avatarColor} text-lg`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground truncate">
              {isWorkspacePending ? <Loader className="w-6 h-6 animate-spin" /> : workspace?.name || "Загрузка..."}
              {isDataLoading && (
                <span className="text-sm text-blue-500">
                  Обновление...
                </span>
              )}
            </h3>
            {workspace?.description && (
              <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1 truncate">
                {workspace.description}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-muted-foreground truncate">
              {process.env.NODE_ENV === 'development' && (
                <span className="text-xs text-blue-500">
                  (ID: {workspaceId})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const iconClass = "text-gray-700 dark:text-foreground";

  const contentActions = (
    <div className="mt-3">
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleGoToZone}
          className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-accent/40"
          onMouseEnter={() => setOpenFolderAnimating(true)}
          onMouseLeave={() => setOpenFolderAnimating(false)}
        >
          <AnimatedFolders isAnimating={openFolderAnimating} />
          <span className="text-sm font-medium">перейти в зону</span>
        </button>

        <button
          type="button"
          onClick={handleViewData}
          className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-accent/40"
          {...viewHoverBind}
        >
          <Podcast className={iconClass} isAnimating={isViewHoverAnimating} />
          <span className="text-sm font-medium">Посмотреть данные</span>
        </button>

        <button
          type="button"
          onClick={handleEdit}
          className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-accent/40"
          {...editHoverBind}
        >
          <ClipboardCopy className={iconClass} isAnimating={isEditHoverAnimating} />
          <span className="text-sm font-medium">Редактировать</span>
        </button>

        <button
          type="button"
          onClick={handleWriteNote}
          className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-accent/40"
          {...noteHoverBind}
        >
          <SmartphoneNfc className={iconClass} isAnimating={isNoteHoverAnimating} />
          <span className="text-sm font-medium">Написать заметку</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadActivity}
          className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-accent/40"
          {...downloadHoverBind}
        >
          <AnimatedCloudDownload isAnimating={isDownloadHoverAnimating} />
          <span className="text-sm font-medium">скачать активность</span>
        </button>

        <button
          type="button"
          onClick={onOpenDialog}
          disabled={isDeletePending}
          className="flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-accent/40"
          {...deleteHoverBind}
        >
          <AnimatedDelete isAnimating={isDeletePending || isDeleteHoverAnimating} />
          <span className="text-sm font-medium">удалить</span>
        </button>
      </div>
    </div>
  );

  const content = (
    <div className="space-y-6 pt-5">
      {contentHeader}
      {contentActions}

      {/* Данные */}
      <div>
         <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
           </svg>
           Данные
         </h4>
         
         {/* Ссылка приглашения */}
         <div className="mb-2">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
               Ссылка приглашения (вступительная) в рабочую зону
             </span>
           </div>
           <div className="flex gap-2">
             <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2 text-sm font-mono text-gray-600 dark:text-gray-400 border">
               {isWorkspacePending ? (
                 <div className="flex items-center gap-2">
                   <Loader className="w-4 h-4 animate-spin" />
                   <span>Загрузка ссылки...</span>
                 </div>
               ) : workspace?.inviteCode ? (
                 `${window.location.origin}${BASE_ROUTE.INVITE_URL.replace(":inviteCode", workspace.inviteCode)}`
               ) : (
                 "Ссылка недоступна"
               )}
             </div>
             <Button
               disabled={!workspace?.inviteCode}
               size="icon"
               onClick={handleCopyInviteLink}
             >
               {copiedInviteLink ? <Check /> : <Copy />}
             </Button>
           </div>
         </div>
         
         {/* ID зоны */}
         <div className="mb-6">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ID зоны
             </span>
           </div>
           <div className="flex gap-2">
             <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md px-3 py-2 text-sm font-mono text-gray-600 dark:text-gray-400 border">
               {isWorkspacePending ? (
                 <div className="flex items-center gap-2">
                   <Loader className="w-4 h-4 animate-spin" />
                   <span>Загрузка ID...</span>
                 </div>
               ) : (
                 workspaceId
               )}
             </div>
                           <Button
                disabled={isWorkspacePending}
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(workspaceId);
                  setCopiedZoneId(true);
                  toast({
                    title: "Уведомление",
                    description: "ID зоны скопирован в буфер обмена",
                    variant: "success",
                  });
                  setTimeout(() => setCopiedZoneId(false), 2000);
                }}
              >
                {copiedZoneId ? <Check /> : <Copy />}
              </Button>
           </div>
         </div>
       </div>

      {/* Аналитика */}
      <div>
         <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
           <ActivityIcon className="w-5 h-5" />
           Аналитика
         </h4>
        
        {/* Карточки аналитики */}
        {!workspaceId ? (
          <div className="text-center py-8 text-gray-500">
            <p>Не удалось определить зону</p>
          </div>
        ) : isDataLoading ? (
          <div className="text-center py-8 text-gray-500">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Загрузка данных зоны...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Все тренировки</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
                         <CardContent>
               <div className="text-2xl font-bold">
                 {analytics?.totalTasks || 0}
               </div>
             </CardContent>
          </Card>
          
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Актуальные</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeTasks}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Просроченные</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.overdueTasks || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выполненные</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.completedTasks || 0}
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* График тренировок */}
        {workspaceId && !isDataLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">График тренировок</CardTitle>
            </CardHeader>
            <CardContent>
              {isWeeklyPending ? (
                <div className="h-[250px] w-full flex items-center justify-center">
                  <Loader className="w-8 h-8 animate-spin" />
                </div>
              ) : weeklyAnalytics && weeklyAnalytics.length > 0 ? (
                <>
                                     <div className="h-[250px] w-full -ml-[50px] w-[calc(100%+50px)]">
                     <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={weeklyAnalytics} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 12, fill: 'currentColor' }}
                          className="text-xs text-gray-900 dark:text-white"
                        />
                        <YAxis 
                          tickFormatter={(value) => Math.round(value).toString()}
                          domain={[0, 'dataMax']}
                          tick={{ fontSize: 12, fill: 'currentColor' }}
                          className="text-xs text-gray-900 dark:text-white"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="completed" fill="#22c55e" name="Выполнено" />
                        <Bar dataKey="total" fill="currentColor" className="text-black dark:text-white" name="Всего" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Легенда */}
                  <div className="flex justify-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#22c55e" }} />
                      <span className="text-gray-800 dark:text-white font-medium">Выполнено</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-black dark:text-white" />
                      <span className="text-gray-800 dark:text-white font-medium">Всего</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[250px] w-full flex items-center justify-center text-gray-500">
                  Нет данных для отображения
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        className="pb-6"
      >
        <div className="max-h-[70vh] overflow-y-auto px-5">
          {content}
        </div>
      </BottomSheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-1/2 sm:w-1/2 md:w-1/2 lg:w-1/2 max-w-none sm:max-w-none md:max-w-none lg:max-w-none h-screen p-0">
        <div className="h-full overflow-y-auto px-6 sm:px-8 md:px-10 py-6">
          {content}
        </div>
      </SheetContent>
      <ConfirmDialog
        isOpen={openConfirm}
        isLoading={isDeletePending}
        onClose={onCloseDialog}
        onConfirm={handleConfirmDeleteWorkspace}
        title={`Удаление зоны`}
        description={`Вы уверены, что хотите удалить рабочую зону? Это действие невозможно отменить.`}
        confirmText="Удалить"
        cancelText="Отменить"
      />
    </Sheet>
  );
};

export default UserSettingsModal;
