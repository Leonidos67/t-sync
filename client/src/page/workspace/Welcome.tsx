import { useAuthContext } from "@/context/auth-provider";
import { usePinnedWorkspaces } from "@/context/pinned-workspaces-provider";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";
import { Link, useParams } from "react-router-dom";
import { Plus, Settings, Pin, Bell, X } from "lucide-react";
import { Rocket } from "@/components/ui/motion/Rocket";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import Logo from "@/components/logo";
import UserSettingsModal from "@/components/workspace/member/user-settings-modal";
import { useState } from "react";

interface Workspace {
  _id: string;
  name: string;
}

interface SelectedUser {
  _id: string;
  name: string;
  description: string;
  joinedAt: Date;
}

const WorkspaceWelcome = () => {
  const { user } = useAuthContext();
  const { onOpen: onOpenCreateWorkspace } = useCreateWorkspaceDialog();
  const { workspaceId } = useParams();
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  console.log('🏠 WorkspaceWelcome - Rendering with user:', user, 'workspaceId:', workspaceId);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { togglePin, isPinned } = usePinnedWorkspaces();
   
  // Если workspaceId не указан, используем "welcome" как fallback
  const currentWorkspaceId = workspaceId || "welcome";
  
  const { data, isPending } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });
  const workspaces = data?.workspaces || [];

  const handleSettingsClick = (workspace: Workspace, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Очищаем предыдущие данные
    setSelectedUser(null);
    setSelectedWorkspace(null);
    
    // Устанавливаем новые данные
    setSelectedUser({
      _id: workspace._id,
      name: workspace.name,
      description: `Спортсмен в зоне ${workspace.name}`,
      joinedAt: new Date(),
    });
    setSelectedWorkspace(workspace);
    setIsSettingsModalOpen(true);
  };

  const handlePinClick = (workspaceId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    togglePin(workspaceId);
  };

  // Разделяем workspace'ы на закрепленные и незакрепленные
  const pinned = workspaces.filter(ws => isPinned(ws._id));
  const unpinned = workspaces.filter(ws => !isPinned(ws._id));

  return (
    <div className="relative">
      {/* Full-bleed light background */}
      <div
        className="fixed inset-0 z-0 block dark:hidden bg-[#fefcff]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e5e7eb 1px, transparent 1px)" +
            "linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
        }}
      />
      {/* Full-bleed dark background */}
      <div
        className="fixed inset-0 z-0 hidden dark:block bg-background"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px)" +
            "linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
        }}
      />
      <main className="flex flex-1 flex-col py-4 md:pt-3 bg-transparent relative z-10 pointer-events-auto main-content">
        <div className="w-full px-4 sm:px-6 lg:px-20">
          {/* Page-specific header */}
          <div className="flex items-center justify-between h-12 mb-4 relative">
            <div className="flex items-center gap-2">
              <Logo url={`/workspace/${currentWorkspaceId}/`} />
              <Link
                to={`/workspace/${currentWorkspaceId}/`}
                className="ml-2 items-center gap-2 self-center font-medium text-foreground"
              >
                Aurora Rise
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 rounded-md hover:bg-accent transition-colors duration-200">
                <Bell className="size-5 text-muted-foreground" />
              </button>
              <button type="button" className="p-2 rounded-md hover:bg-accent transition-colors duration-200">
                <Settings className="size-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Приветствие */}
          <div className="mb-6 flex items-center justify-center text-center">
            <div className="text-xl font-semibold text-foreground">
              {workspaces.length === 0 ? (
                `👋 Добро пожаловать в Aurora Rise, ${user?.name || "пользователь"}!`
              ) : (
                <div className="flex items-center gap-2">
                  <span>
                    {`👋 Добро пожаловать в Тренерскую зону, ${user?.name || "пользователь"}`}
                  </span>
                  <Link
                    to={`/id/?tab=settings&settingsTab=location`}
                    className="inline-flex items-center p-1 rounded-md hover:bg-accent transition-colors"
                    aria-label="Редактировать личные данные"
                  >
                    {/* Using same icon as on ID page */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Закрепленные спортсмены */}
          {!isPending && pinned.length > 0 && (
            <div className="mb-6">
              <div className="rounded-lg border bg-card p-3 shadow-sm">
                <div className="text-sm font-medium mb-2 text-foreground">Закрепленные спортсмены</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pinned.map((ws: Workspace) => (
                    <div key={ws._id} className="relative group">
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center gap-1 z-50">
                        <button
                          type="button"
                          className="p-2 rounded-full hover:bg-accent/40 border border-border transition-colors duration-200"
                          onClick={(e) => handlePinClick(ws._id, e)}
                        >
                          <div className="group/pin">
                            <Pin className="size-4 text-muted-foreground rotate-45 group-hover/pin:hidden" />
                            <X className="size-4 text-muted-foreground hidden group-hover/pin:block" />
                          </div>
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-full hover:bg-accent/40 border border-border transition-colors duration-200"
                          onClick={(e) => handleSettingsClick(ws, e)}
                        >
                          <Settings className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                      <Link
                        to={`/workspace/${ws._id}/home`}
                        className="group block"
                      >
                        <div className="relative flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200 shadow-sm hover:shadow-md pr-14">
                          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent/40 text-sm font-semibold text-foreground">
                            {ws.name?.trim()?.charAt(0) || "W"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-foreground truncate">{ws.name}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Rocket width={20} height={20} stroke="#6b7280" strokeWidth={1.8} isHovered={true} />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Мои спортсмены */}
          <div className="mb-6">
            <div className="rounded-lg border bg-card p-3 shadow-sm">
              <div className="text-sm font-medium mb-2 text-foreground">
                {workspaces.length === 0 ? "Создайте первое рабочее пространство" : "Мои спортсмены"}
              </div>
              {isPending ? (
                <div className="text-sm text-muted-foreground">Загрузка...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Fixed first card: Create new athlete */}
                  <button
                    type="button"
                    onClick={onOpenCreateWorkspace}
                    className="group block text-left"
                  >
                    <div className="relative flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200 shadow-sm hover:shadow-md"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
                        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
                    }}
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent/40 text-sm font-semibold text-foreground">
                        <Plus className="size-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {workspaces.length === 0 ? "Создать первое рабочее пространство" : "Создать нового спортсмена"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {workspaces.length === 0 ? "Начать работу с Aurora Rise" : "Добавить участника"}
                        </span>
                      </div>
                    </div>
                  </button>
                  {unpinned.map((ws: Workspace) => (
                    <div key={ws._id} className="relative group">
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center gap-1 z-50">
                        <button
                          type="button"
                          className="p-2 rounded-full hover:bg-accent/40 border border-border transition-colors duration-200"
                          onClick={(e) => handlePinClick(ws._id, e)}
                        >
                          <Pin className="size-4 text-muted-foreground rotate-45" />
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-full hover:bg-accent/40 border border-border transition-colors duration-200"
                          onClick={(e) => handleSettingsClick(ws, e)}
                        >
                          <Settings className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                      <Link
                        to={`/workspace/${ws._id}/home`}
                        className="group block"
                      >
                        <div className="relative flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200 shadow-sm hover:shadow-md pr-14">
                          <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent/40 text-sm font-semibold text-foreground">
                            {ws.name?.trim()?.charAt(0) || "W"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-foreground truncate">{ws.name}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Rocket width={20} height={20} stroke="#6b7280" strokeWidth={1.8} isHovered={true} />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Модальное окно настроек пользователя */}
      <UserSettingsModal
        open={isSettingsModalOpen}
        onOpenChange={(open) => {
          setIsSettingsModalOpen(open);
          if (!open) {
            setSelectedUser(null);
            setSelectedWorkspace(null);
          }
        }}
        user={selectedUser}
        workspaceId={selectedWorkspace?._id}
      />
    </div>
  );
};

export default WorkspaceWelcome;
