import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon, MapPinIcon, X } from "lucide-react";

interface CreateClubPostBlockProps {
  onPostCreate: (postData: {
    text: string;
    image?: string | null;
    location?: string;
    isPublic: boolean;
  }) => void;
  isLoading?: boolean;
  clubName: string;
  clubAvatar?: string | null;
}

const CreateClubPostBlock: React.FC<CreateClubPostBlockProps> = ({ 
  onPostCreate, 
  isLoading = false, 
  clubName,
  clubAvatar 
}) => {
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPostImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim()) return;
    
    onPostCreate({
      text: postText,
      image: postImage,
      location: location.trim() || undefined,
      isPublic
    });
    
    // Сброс формы и сворачивание
    setPostText("");
    setPostImage(null);
    setLocation("");
    setIsPublic(true);
    setIsExpanded(false);
  };

  const handleInputClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    // Очищаем форму при сворачивании
    setPostText("");
    setPostImage(null);
    setLocation("");
    setIsPublic(true);
  };

  return (
    <div className="border border-border rounded-3xl p-4 transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Аватарка клуба и инпут - всегда видны */}
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage 
              src={clubAvatar || ''} 
              alt={clubName} 
            />
            <AvatarFallback className="text-lg">
              {clubName?.[0] || 'К'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            {!isExpanded ? (
              <Input
                placeholder={`Что нового в клубе ${clubName}?`}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onClick={handleInputClick}
                disabled={isLoading}
                className="cursor-pointer border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
              />
            ) : (
              <Textarea
                placeholder={`Что нового в клубе ${clubName}?`}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                disabled={isLoading}
                rows={3}
                className="resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
              />
            )}
            {/* Крест для сворачивания - показывается только в развернутом виде */}
            {isExpanded && (
              <button
                type="button"
                onClick={handleCollapse}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Дополнительные опции - показываются только в развернутом виде */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Загрузка изображения */}
            <div className="space-y-2">
              <Label htmlFor="club-post-image" className="text-sm font-medium">
                Добавить изображение
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="club-post-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="text-sm"
                />
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              {postImage && (
                <div className="relative">
                  <img 
                    src={postImage} 
                    alt="Предпросмотр" 
                    className="max-h-48 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setPostImage(null)}
                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Кнопка Опубликовать - справа */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !postText.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? "Публикуем..." : "Опубликовать"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateClubPostBlock;
