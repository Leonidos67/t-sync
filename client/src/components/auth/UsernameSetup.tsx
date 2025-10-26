import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import { setUsernameMutationFn } from "@/lib/api";
import { useAuthContext } from "@/context/auth-provider";
import SocialLogo from "@/components/logo/social-logo";

const usernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username должен содержать минимум 3 символа")
    .max(20, "Username не должен превышать 20 символов")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username может содержать только буквы, цифры и подчеркивания"
    )
    .refine(
      (val) => !val.startsWith("_") && !val.endsWith("_"),
      "Username не может начинаться или заканчиваться подчеркиванием"
    ),
});

type UsernameFormData = z.infer<typeof usernameSchema>;

interface UsernameSetupProps {
  onSuccess: () => void;
}

const UsernameSetup = ({ onSuccess }: UsernameSetupProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "available" | "taken">("idle");
  const { refetchAuth: refetchUser } = useAuthContext();

  const form = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const { mutate: setUsername, isPending } = useMutation({
    mutationFn: setUsernameMutationFn,
    onSuccess: () => {
      toast({
        title: "Успешно!",
        description: "Username успешно установлен",
      });
      refetchUser();
      onSuccess();
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      if (error?.response?.data?.message?.includes("уже занят")) {
        setUsernameStatus("taken");
        toast({
          title: "Ошибка",
          description: "Этот username уже занят",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ошибка",
          description: error?.message || "Произошла ошибка при установке username",
          variant: "destructive",
        });
      }
    },
  });

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }

    setIsChecking(true);
    try {
      // Проверяем доступность username через API
      const response = await fetch(`http://localhost:8000/api/user/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      
      if (data.available) {
        setUsernameStatus("available");
      } else {
        setUsernameStatus("taken");
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameStatus("idle");
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmit = (data: UsernameFormData) => {
    if (usernameStatus !== "available") {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите доступный username",
        variant: "destructive",
      });
      return;
    }

    setUsername(data.username);
  };

  const handleUsernameChange = (value: string) => {
    form.setValue("username", value);
    setUsernameStatus("idle");
    
    // Проверяем доступность с задержкой
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="tsygram-dark bg-background text-foreground min-h-svh flex items-center justify-center px-4 sm:px-2 lg:px-8 pb-16 md:pb-0">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SocialLogo url={null} />
            <span className="text-2xl font-bold text-primary">Volt</span>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Создание username</h1>
          <p className="text-muted-foreground">
            Выберите уникальный username для вашего профиля
          </p>
        </div>

        {/* Карточка создания username */}
        <Card className="bg-background rounded-3xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-3xl">
              <p className="text-sm text-primary font-medium">
                ⚠️ Обязательный шаг
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Username необходим для использования платформы Volt
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Username
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Введите username"
                                className="h-12 border-border focus:border-primary focus:ring-primary pr-10"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleUsernameChange(e.target.value);
                                }}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isChecking && (
                                  <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
                                )}
                                {!isChecking && usernameStatus === "available" && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {!isChecking && usernameStatus === "taken" && (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {usernameStatus === "available" && (
                            <p className="text-sm text-green-600 dark:text-green-400">
                              ✓ Username доступен
                            </p>
                          )}
                          {usernameStatus === "taken" && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              ✗ Username уже занят
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={isPending || usernameStatus !== "available"}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isPending && <Loader className="animate-spin mr-2" />}
                      Создать username
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Продукт сервиса{" "}
            <a href="/" className="underline hover:text-primary transition-colors">
              Aurora Rise
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsernameSetup;
