import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader } from "lucide-react";
import SocialContainer from "@/components/SocialContainer";
import useAuth from "@/hooks/api/use-auth";
import { createClubMutationFn, getUserCreatedClubsQueryFn } from "@/lib/api";

interface Club {
  _id: string;
  name: string;
  username: string;
  description: string;
  creator: {
    _id: string;
    username: string;
    name: string;
    profilePicture: string | null;
    userRole?: "coach" | "athlete" | null;
  };
  members: Array<{
    _id: string;
    username: string;
    name: string;
    profilePicture: string | null;
  }>;
  createdAt: string;
}

const ClubCreatePage = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [myClubsLoading, setMyClubsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    description: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentUser?.user) {
      setMyClubsLoading(true);
      getUserCreatedClubsQueryFn()
        .then((data) => setMyClubs(data.clubs || []))
        .catch(() => setMyClubs([]))
        .finally(() => setMyClubsLoading(false));
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название клуба обязательно";
    } else if (formData.name.length < 3) {
      newErrors.name = "Название должно содержать минимум 3 символа";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username обязателен";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = "Username может содержать только буквы, цифры, _ и -";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username должен содержать минимум 3 символа";
    }

    if (formData.description.trim() && formData.description.length < 10) {
      newErrors.description = "Описание должно содержать минимум 10 символов";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const clubData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        description: formData.description.trim() || undefined
      };
      await createClubMutationFn(clubData);
      navigate(`/u/clubs/${formData.username}`);
    } catch (error: unknown) {
      console.error("Ошибка при создании клуба:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Произошла ошибка при создании клуба. Попробуйте еще раз.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialContainer>
      <div className="w-full max-w-4xl flex flex-col gap-4 sm:gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/u/clubs")}
            className="mb-2 inline-flex items-center h-auto rounded-full px-4 py-1 text-sm hover-secondary border border-border"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к клубам
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Создание клуба</h1>
          <p className="text-muted-foreground mt-2">
            Создайте новое сообщество и пригласите участников
          </p>
        </div>

        <Card className="rounded-3xl">
          <CardContent className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Название клуба *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Введите название клуба"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">@</span>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value.toLowerCase())}
                    placeholder="username"
                    className={`flex-1 ${errors.username ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Username будет использоваться в URL: /u/clubs/{formData.username || "username"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание клуба</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Расскажите о целях и тематике вашего клуба"
                  className={`min-h-[100px] ${errors.description ? "border-destructive" : ""}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/500 символов
                </p>
              </div>

              {errors.submit && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{errors.submit}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/u/clubs")}
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    "Создать клуб"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SocialContainer>
  );
};

export default ClubCreatePage;