import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { removeToken } from "@/lib/tokenStorage";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      // Удаляем JWT токен из localStorage
      removeToken();
      console.log('🔑 JWT token removed from localStorage');
      
      queryClient.resetQueries({
        queryKey: ["authUser"],
      });
      navigate("/");
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Уведомление",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle logout action
  const handleLogout = useCallback(() => {
    if (isPending) return;
    mutate();
  }, [isPending, mutate]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вы уверены, что хотите выйти из системы?</DialogTitle>
            <DialogDescription>
              На этом ваша текущая сессия завершится, и вам нужно будет снова войти в систему
              чтобы получить доступ к своей учетной записи.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Отменить
            </Button>
            <Button disabled={isPending} type="button" onClick={handleLogout}>
              {isPending && <Loader className="animate-spin" />}
              Выйти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
