import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import SocialLogo from "@/components/logo/social-logo";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import { useMutation } from "@tanstack/react-query";
import { registerMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { getAuroraUser, AuroraUser } from "@/lib/aurora-storage";
import useVoltAuth from "@/hooks/api/use-volt-auth";
import UsernameSetup from "@/components/auth/UsernameSetup";

const VoltSignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromAurora = searchParams.get("fromAurora") === "true";
  const { data: currentUser } = useVoltAuth();
  const [auroraUser, setAuroraUser] = useState<AuroraUser | null>(null);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);

  // Загружаем данные о пользователе Aurora Rise из localStorage
  useEffect(() => {
    const savedUser = getAuroraUser();
    if (savedUser) {
      setAuroraUser(savedUser);
    }
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });
  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Укажите имя",
    }),
    email: z.string().trim().email("Неверный адрес почты").min(1, {
      message: "Требуется указать электронную почту",
    }),
    password: z.string().trim().min(1, {
      message: "Укажите пароль",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        
        // Проверяем, есть ли у пользователя username
        if (!user.username) {
          setShowUsernameSetup(true);
          return;
        }
        
        // После успешной регистрации перенаправляем на Volt
        navigate("/u/");
      },
      onError: (error) => {
        console.log(error);
        toast({
          title: "Уведомление",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Обработчик для компонента UsernameSetup
  const handleUsernameSuccess = () => {
    setShowUsernameSetup(false);
    navigate("/u/");
  };

  // Если нужно показать компонент создания username
  if (showUsernameSetup) {
    return (
      <UsernameSetup 
        onSuccess={handleUsernameSuccess}
      />
    );
  }

  return (
    <div className="tsygram-dark bg-background text-foreground min-h-svh flex items-center justify-center px-4 sm:px-2 lg:px-8 pb-16 md:pb-0">
      <div className="w-full max-w-md">
        {/* Логотип и заголовок - теперь в центре вместе с формой */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <SocialLogo url={null} />
            <span className="text-2xl font-bold text-primary">Volt</span>
          </div>
          <p className="text-muted-foreground">
            Сообщество спортсменов и тренеров
          </p>
        </div>

        {/* Карточка регистрации */}
        <Card className="bg-background rounded-3xl shadow-2xl">
          <CardHeader className="text-center">
            {(fromAurora || auroraUser) && (
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-3xl">
                <p className="text-sm text-primary font-medium">
                  🔐 Обнаружен вход в Aurora Rise Platform
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Вы можете создать новый аккаунт{" "}
                  <Link 
                    to="/id" 
                    className=" hover:text-primary/80 font-medium underline underline-offset-2"
                  >
                    Aurora Rise ID
                  </Link>{" "}
                  для Volt или войти в существующий
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <GoogleOauthButton label="Зарегистрироваться через Google" />
                  </div>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-card px-4 text-muted-foreground">
                      или
                    </span>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Ник
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                className="h-12 border-border focus:border-primary focus:ring-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Электронная почта
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                className="h-12 border-border focus:border-primary focus:ring-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-2">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-foreground">
                              Пароль
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder=""
                                className="h-12 border-border focus:border-primary focus:ring-primary"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {isPending && <Loader className="animate-spin mr-2" />}
                      Создать аккаунт
                    </Button>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    У вас есть аккаунт?{" "}
                    <Link
                      to={(fromAurora || auroraUser) ? "/volt-login?fromAurora=true" : "/volt-login"}
                      className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                    >
                      Войти
                    </Link>
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

export default VoltSignUp;
