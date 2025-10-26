import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader
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
import { loginMutationFn, autoLoginMutationFn } from "@/lib/api";
import { setToken } from "@/lib/tokenStorage";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import useVoltAuth from "@/hooks/api/use-volt-auth";
import { saveAuroraUser, getAuroraUser, clearAuroraUser, AuroraUser, setAutoLoginSuccess } from "@/lib/aurora-storage";
import UsernameSetup from "@/components/auth/UsernameSetup";

const VoltLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const fromAurora = searchParams.get("fromAurora") === "true";
  const { data: currentUser, isLoading: authLoading, error: authError } = useVoltAuth();
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);
  const [auroraUser, setAuroraUser] = useState<AuroraUser | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);

  // Отладочная информация
  console.log('VoltLogin - currentUser:', currentUser);
  console.log('VoltLogin - authLoading:', authLoading);
  console.log('VoltLogin - authError:', authError);
  console.log('VoltLogin - fromAurora:', fromAurora);
  console.log('VoltLogin - auroraUser:', auroraUser);

  // Загружаем данные о пользователе Aurora Rise из localStorage
  useEffect(() => {
    const savedUser = getAuroraUser();
    if (savedUser) {
      setAuroraUser(savedUser);
    }
  }, []);

  // Сохраняем данные пользователя Aurora Rise при первом входе
  useEffect(() => {
    if (currentUser?.user && fromAurora) {
      saveAuroraUser(currentUser.user as AuroraUser);
      setAuroraUser(currentUser.user as AuroraUser);
    }
  }, [currentUser, fromAurora]);

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  // Функция для автоматического входа в аккаунт Aurora Rise ID
  const handleAutoLogin = () => {
    const userEmail = auroraUser?.email || currentUser?.user?.email;
    if (!userEmail) return;
    
    setAutoLoginLoading(true);
    autoLoginMutationFn(userEmail, 'volt')
      .then((data) => {
        const user = data.user;
        console.log('Auto login successful:', user);
        console.log('Return URL:', returnUrl);
        
        // Проверяем, есть ли у пользователя username
        if (!user.username) {
          setShowUsernameSetup(true);
          setAutoLoginLoading(false);
          return;
        }
        
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        console.log('Decoded URL:', decodedUrl);
        
        // Всегда перенаправляем в Volt, игнорируя любые другие URL
        const targetUrl = decodedUrl || `/u/`;
        console.log('Navigating to:', targetUrl);
        
        // Устанавливаем флаг успешного автоматического входа
        setAutoLoginSuccess();
        
        // Очищаем сохраненные данные после успешного входа
        clearAuroraUser();
        
        navigate(targetUrl);
      })
      .catch((error) => {
        console.error('Auto login error:', error);
        toast({
          title: "Уведомление",
          description: error.message || "Ошибка автоматического входа",
          variant: "destructive",
        });
      })
      .finally(() => {
        setAutoLoginLoading(false);
      });
  };

  const formSchema = z.object({
    email: z.string().trim().email("Неверный адрес почты").min(1, {
      message: "Укажите название для рабочей области",
    }),
    password: z.string().trim().min(1, {
      message: "Укажите пароль",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        const token = (data as any).token; // JWT токен от бэкенда
        
        console.log(user);
        
        // Сохраняем JWT токен в localStorage
        if (token) {
          setToken(token);
          console.log('🔑 JWT token saved to localStorage');
        }
        
        // Проверяем, есть ли у пользователя username
        if (!user.username) {
          setShowUsernameSetup(true);
          return;
        }
        
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        // Всегда перенаправляем в Volt, игнорируя любые другие URL
        navigate(decodedUrl || `/u/`);
      },
      onError: (error) => {
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
    const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
    navigate(decodedUrl || `/u/`);
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
            Рады видеть вас снова!
          </p>
        </div>

        {/* Карточка входа */}
        <Card className="bg-background rounded-3xl shadow-2xl">
          <CardHeader className="text-center">
            {(() => {
              const shouldShowBlock = fromAurora || auroraUser || currentUser?.user;
              console.log('VoltLogin - shouldShowBlock:', shouldShowBlock);
              console.log('VoltLogin - fromAurora:', fromAurora);
              console.log('VoltLogin - auroraUser:', auroraUser);
              console.log('VoltLogin - currentUser?.user:', currentUser?.user);
              
              return shouldShowBlock && !showLoginForm && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-3xl">
                  <p className="text-sm text-primary font-medium">
                    🔐 Обнаружен вход в Aurora Rise Platform
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Вы можете войти в этот же аккаунт{" "}
                    <Link 
                      to="/id" 
                      className=" hover:text-primary/80 font-medium underline underline-offset-2"
                    >
                      Aurora Rise ID
                    </Link>{" "}
                    или создать новый
                  </p>
                  {(currentUser?.user || auroraUser) && (
                    <div className="mt-4 space-y-2">
                      <Button
                        onClick={handleAutoLogin}
                        disabled={autoLoginLoading || isPending}
                        className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium"
                      >
                        {autoLoginLoading ? (
                          <>
                            <Loader className="animate-spin mr-2 w-4 h-4" />
                            Входим...
                          </>
                        ) : (
                          `Войти как ${(currentUser?.user || auroraUser)?.name}`
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowLoginForm(true)}
                        variant="outline"
                        className="w-full h-10 text-sm font-medium border-border text-foreground hover:bg-muted"
                      >
                        Войти в другой аккаунт
                      </Button>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardHeader>
          <CardContent className="pt-0">
            {(() => {
              const shouldShowForm = showLoginForm || !(fromAurora || auroraUser || currentUser?.user);
              
              if (!shouldShowForm) {
                return null;
              }
              
              return (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-6">
                      <div className="flex flex-col gap-4">
                        <GoogleOauthButton label="Войти через Google" />
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
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-foreground">
                                  Электронная почта
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="your@email.com"
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
                                <div className="flex items-center">
                                  <FormLabel className="text-sm font-medium text-foreground">
                                    Пароль
                                  </FormLabel>
                                </div>
                                <FormControl>
                                  <Input
                                    type="password"
                                    placeholder="Введите пароль"
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
                          disabled={isPending}
                          type="submit"
                          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          {isPending && <Loader className="animate-spin mr-2" />}
                          Войти в Aurora Volt
                        </Button>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Нет учетной записи?{" "}
                        <Link
                          to={(fromAurora || auroraUser) ? "/volt-signup?fromAurora=true" : "/volt-signup"}
                          className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
                        >
                          Создать аккаунт
                        </Link>
                      </div>
                    </div>
                  </form>
                </Form>
              );
            })()}
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

export default VoltLogin;