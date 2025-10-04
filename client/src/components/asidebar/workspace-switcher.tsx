import { ArrowLeft } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";

// removed workspace type usage in simplified button-only variant

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { open } = useSidebar();
  const workspaceId = useWorkspaceId();
  const { data } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });
  const activeWorkspaceName = data?.workspaces?.find((w: { _id: string }) => w._id === workspaceId)?.name;

  return (
    <SidebarMenu className={`transition-transform duration-200 ${!open ? '-translate-x-0' : ''}`}>
      {open ? (
        // Полный блок когда сайдбар открыт
        <SidebarMenuItem>
          <div className="min-h-[80px] w-full bg-card relative rounded-lg overflow-hidden border">
            {/* Bottom Fade Grid Background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                  linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
                `,
                backgroundSize: "20px 30px",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 p-3">
              {/* Тренерская зона кнопка */}
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full mb-2"
                onClick={() => navigate(`/workspace/${workspaceId}`)}
              >
                <div className="flex items-center gap-2 w-full">
                  <ArrowLeft className="size-4" />
                  <span>Тренерская зона</span>
                </div>
              </SidebarMenuButton>
              
              {/* Разделительная линия */}
              {activeWorkspaceName && (
                <div className="border-t border-border my-2" />
              )}
              
              {/* Отображение выбранной зоны */}
              {activeWorkspaceName ? (
                <div className="px-3 py-1 text-xs text-muted-foreground truncate rounded px-2 py-1" title={activeWorkspaceName}>
                  {activeWorkspaceName}
                </div>
              ) : null}
            </div>
          </div>
        </SidebarMenuItem>
      ) : (
        // Только иконка когда сайдбар скрыт
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            onClick={() => navigate(`/workspace/${workspaceId}`)}
          >
            <div className="w-full flex items-center justify-center">
              <ArrowLeft className="size-4" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
