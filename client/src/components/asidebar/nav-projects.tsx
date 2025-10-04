import {
  ArrowRight,
  Loader,
  MoreHorizontal,
  Plus,
  Move,
} from "lucide-react";
import { AnimatedFolders } from "@/components/ui/motion/AnimatedFolders";
import { AnimatedDelete } from "@/components/ui/motion/AnimatedDelete";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import { ConfirmDialog } from "../resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Button } from "../ui/button";
// removed permission guards for universal access
import { useState } from "react";
import * as React from "react";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { PaginationType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/context/auth-provider";
import { AnimatedUsers } from "../ui/motion/AnimatedUsers";
import { DraggableModal } from "../ui/draggable-modal";
import { RoomsModalContent } from "../workspace/rooms-modal-content";
import { cn } from "@/lib/utils";

export function NavProjects({ compact = false, onItemClick }: { compact?: boolean; onItemClick?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useAuthContext();

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { isMobile, open } = useSidebar();
  const { onOpen } = useCreateProjectDialog();
  const { context, open: openDialog, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [openFolderAnimating, setOpenFolderAnimating] = React.useState(false);
  const [deleteAnimating, setDeleteAnimating] = React.useState(false);
  const [addUserAnimating, setAddUserAnimating] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const isCoach = user?.userRole === "coach";
  const isAthlete = user?.userRole === "athlete";
  // owner check not used after removing guards

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { data, isPending, isFetching, isError } =
    useGetProjectsInWorkspaceQuery({
      workspaceId,
      pageSize,
      pageNumber,
    });

  const projects = data?.projects || [];
  const pagination = data?.pagination || ({} as PaginationType);
  const hasMore = pagination?.totalPages > pageNumber;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 5);
  };

  const handleConfirm = () => {
    if (!context) return;
    mutate(
      {
        workspaceId,
        projectId: context?._id,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ["allprojects", workspaceId],
          });
          toast({
            title: "Уведомление",
            description: data.message,
            variant: "success",
          });

          navigate(`/workspace/${workspaceId}/home`);
          setTimeout(() => onCloseDialog(), 100);
        },
        onError: (error) => {
          toast({
            title: "Уведомление",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsSidebarVisible(false);
  };

  const handleRestoreToSidebar = () => {
    setIsModalOpen(false);
    setIsSidebarVisible(true);
  };
  return (
    <>
      {(!compact && isSidebarVisible) && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="w-full justify-between pr-0">
          <span>
            {isCoach ? "Комнаты для спортсмена" : isAthlete ? "Мои комнаты" : "Комнаты для спортсмена"}
          </span>

          {/* Кнопки для всех пользователей */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpen}
              type="button"
              className="flex size-5 items-center justify-center rounded-full border"
            >
              <Plus className="size-3.5" />
            </button>
            <button
              onClick={handleOpenModal}
              type="button"
              className="hidden md:flex size-5 items-center justify-center rounded-full border"
            >
              <Move className="size-3.5" />
            </button>
          </div>
        </SidebarGroupLabel>
        <SidebarMenu className={`h-[320px] scrollbar overflow-y-auto pb-2 transition-transform duration-200 ${!open ? '-translate-x-2' : ''}`}>
          {isError ? <div></div> : null}
          {isPending ? (
            <Loader
              className=" w-5 h-5
             animate-spin
              place-self-center"
            />
          ) : null}

          {!isPending && projects?.length === 0 ? (
            <div className="pl-3">
              <p className="text-xs text-muted-foreground">
                {isCoach 
                  ? "У вас пока нет комнат. Созданные вами комнаты будут отображаться здесь."
                  : isAthlete 
                  ? "У вас пока нет комнат. Созданные вами комнаты будут отображаться здесь."
                  : "У вас пока нет комнат. Созданные вами комнаты будут отображаться здесь."
                }
              </p>
              {/* Кнопка создания для всех пользователей */}
              <Button
                variant="link"
                type="button"
                className="h-0 p-0 text-[13px] underline font-semibold mt-4"
                onClick={onOpen}
              >
                {isCoach ? "Создать комнату" : isAthlete ? "Создать комнату" : "Создать комнату"}
                <ArrowRight />
              </Button>
            </div>
          ) : (
            projects.map((item) => {
              const projectUrl = `/workspace/${workspaceId}/project/${item._id}`;

              return (
                <SidebarMenuItem key={item._id}>
                  <SidebarMenuButton asChild isActive={projectUrl === pathname}>
                    <Link to={projectUrl} onClick={onItemClick}>
                      {item.emoji}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">Еще</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >

                    <DropdownMenuItem
                      className="!cursor-pointer"  
                      onClick={() => navigate(`${projectUrl}`)}
                      onMouseEnter={() => setOpenFolderAnimating(true)}
                      onMouseLeave={() => setOpenFolderAnimating(false)}
                    >
                      <AnimatedFolders isAnimating={openFolderAnimating} />
                      <span>Открыть</span>
                    </DropdownMenuItem>
                    
                    {/* Кнопка "Добавить участника" доступна всем */}
                    <DropdownMenuItem asChild className="!cursor-pointer">
                      <Link 
                        to={`/workspace/${workspaceId}/members`} 
                        className="flex items-center gap-2"
                        onMouseEnter={() => setAddUserAnimating(true)}
                        onMouseLeave={() => setAddUserAnimating(false)}
                      >
                        <AnimatedUsers isAnimating={addUserAnimating} />
                        <span>Добавить участника</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Кнопка "Удалить комнату" доступна всем (с подтверждением) */}
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="!cursor-pointer"
                        disabled={isLoading}
                        onClick={() => onOpenDialog(item)}
                        onMouseEnter={() => setDeleteAnimating(true)}
                        onMouseLeave={() => setDeleteAnimating(false)}
                      >
                        <AnimatedDelete isAnimating={deleteAnimating} />
                        <span>Удалить комнату</span>
                      </DropdownMenuItem>
                    </>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-sidebar-foreground/70"
                disabled={isFetching}
                onClick={fetchNextPage}
              >
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>{isFetching ? "Загрузка..." : "Загрузить еще"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
      )}

      {/* Компактный режим: только список без заголовка и кнопок */}
      {compact && (
        <SidebarGroup className={cn("!py-0 !px-0", "group-data-[collapsible=icon]:hidden") }>
          <SidebarMenu className={cn("max-h-[320px] overflow-y-auto pb-0 transition-transform duration-200 !px-0", !open ? '-translate-x-2' : '')}>
            {isError ? <div></div> : null}
            {isPending ? (
              <Loader className="w-5 h-5 animate-spin place-self-center" />
            ) : null}

            {!isPending && projects?.length === 0 ? (
              <div className="pl-3">
                <p className="text-xs text-muted-foreground">
                  {"Нет комнат для отображения."}
                </p>
              </div>
            ) : (
              projects.map((item) => {
                const projectUrl = `/workspace/${workspaceId}/project/${item._id}`;
                return (
                  <SidebarMenuItem key={item._id} className="!px-0">
                    <div className="flex items-center justify-between gap-1 pr-2 w-full">
                      <SidebarMenuButton asChild isActive={projectUrl === pathname} className="!px-2">
                        <Link to={projectUrl} onClick={onItemClick}>
                          {item.emoji}
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-md hover:bg-accent/60">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Еще</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-lg">
                          <DropdownMenuItem className="!cursor-pointer" onClick={() => navigate(projectUrl)}>
                            Открыть
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="!cursor-pointer">
                            <Link to={`/workspace/${workspaceId}/members`}>
                              Добавить участника
                            </Link>
                          </DropdownMenuItem>
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="!cursor-pointer !text-destructive"
                              disabled={isLoading}
                              onClick={() => onOpenDialog(item)}
                            >
                              Удалить комнату
                            </DropdownMenuItem>
                          </>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                );
              })
            )}

            {hasMore && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-sidebar-foreground/70"
                  disabled={isFetching}
                  onClick={fetchNextPage}
                >
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>{isFetching ? "Загрузка..." : "Загрузить еще"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      )}

      <DraggableModal
        isOpen={isModalOpen}
        onRestore={handleRestoreToSidebar}
        title={isCoach ? "Комнаты для спортсмена" : isAthlete ? "Мои комнаты" : "Комнаты для спортсмена"}
      >
        <RoomsModalContent />
      </DraggableModal>

      <ConfirmDialog
        isOpen={openDialog}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={isCoach ? "Удаление комнаты" : "Удаление тренировки"}
        description={`Вы уверены, что хотите удалить "${
          context?.name || "this item"
        }"? Это действие невозможно отменить.`}
        confirmText="Удалить"
        cancelText="Отменить"
      />
    </>
  );
}
