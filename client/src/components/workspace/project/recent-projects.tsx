import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { Loader } from "lucide-react";
import { getAvatarColor, getAvatarFallbackText } from "@/lib/helper";
import { format } from "date-fns";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMutationFn } from "@/lib/api";
import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "@/hooks/use-toast";
// removed add-room button

const RecentProjects = () => {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  useAuthContext();

  const { context, open, onCloseDialog } = useConfirmDialog();
  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { data, isPending } = useGetProjectsInWorkspaceQuery({
    workspaceId,
    pageNumber: 1,
    pageSize: 10,
  });

  const projects = data?.projects || [];

  return (
    <div className="flex flex-col pt-2">
      {isPending ? (
        <Loader
          className="w-8 h-8
         animate-spin
         place-self-center
         flex"
        />
      ) : null}
      {projects?.length === 0 && (
        <div
          className="font-semibold
         text-sm text-muted-foreground
          text-center py-5"
        >
          Ни одна комната еще не создана
        </div>
      )}

      {/* removed add-room action bar */}

      <ul role="list" className="space-y-3">
        {projects.map((project) => {
          const name = project.createdBy.name;
          const initials = getAvatarFallbackText(name);
          const avatarColor = getAvatarColor(name);

          return (
            <li
              key={project._id}
              role="listitem"
              className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-card border-0 dark:border-0 hover:bg-gray-50 dark:hover:bg-accent/50 transition-colors duration-200"
            >
              {/* Project Emoji */}
              <div className="flex-shrink-0">
                <div className="text-xl !leading-[1.4rem]">
                  {project.emoji}
                </div>
              </div>

              {/* Project Details */}
              <div className="flex flex-col flex-grow">
                <Link to={`/workspace/${workspaceId}/project/${project._id}`} className="block">
                  <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                    {project.name}
                  </p>
                </Link>
                <p className="text-sm text-gray-500 dark:text-muted-foreground">
                  {project.createdAt ? format(project.createdAt, "PPP") : null}
                </p>
              </div>

              {/* Right side: creator */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500 dark:text-muted-foreground">Создатель:</span>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={project.createdBy.profilePicture || ""} alt="Avatar" />
                  <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
                </Avatar>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        isOpen={open}
        isLoading={isDeleting}
        onClose={onCloseDialog}
        onConfirm={() => {
          if (!context) return;
          mutate(
            { workspaceId, projectId: context._id },
            {
              onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["allprojects", workspaceId] });
                toast({ title: "Уведомление", description: data.message, variant: "success" });
                onCloseDialog();
              },
              onError: (error: unknown) => {
                const message = (error as { message?: string })?.message || "Произошла ошибка";
                toast({ title: "Уведомление", description: message, variant: "destructive" });
              },
            }
          );
        }}
        title="Удаление комнаты"
        description={`Вы уверены, что хотите удалить "${context?.name || "эту комнату"}"? Это действие невозможно отменить.`}
        confirmText="Удалить"
        cancelText="Отменить"
      />
    </div>
  );
};

export default RecentProjects;
