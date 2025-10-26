import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon, MapPinIcon, X } from "lucide-react";
import useAuth from "@/hooks/api/use-auth";

interface CreatePostBlockProps {
  onPostCreate: (postData: {
    text: string;
    image?: string | null;
    location?: string;
    isPublic: boolean;
  }) => void;
  isLoading?: boolean;
}

const CreatePostBlock: React.FC<CreatePostBlockProps> = ({ onPostCreate, isLoading = false }) => {
  const { data: currentUser } = useAuth();
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
        {/* Аватарка и инпут - всегда видны */}
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage 
              src={currentUser?.user?.profilePicture || ''} 
              alt={currentUser?.user?.name || 'Пользователь'} 
            />
            <AvatarFallback className="text-lg">
              {currentUser?.user?.name?.[0] || 'П'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 relative">
            {!isExpanded ? (
              <Input
                placeholder="Что у вас нового?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                onClick={handleInputClick}
                disabled={isLoading}
                className="cursor-pointer border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
              />
            ) : (
              <Textarea
                placeholder="Что у вас нового?"
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
                className="absolute top-2 right-2 p-1 rounded-md hover:bg-secondary/50 transition-colors"
                disabled={isLoading}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Дополнительные опции - появляются при разворачивании с анимацией */}
        {isExpanded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            {/* Превью изображения */}
            {postImage && (
              <div className="relative animate-in fade-in duration-300">
                <img 
                  src={postImage} 
                  alt="Превью" 
                  className="max-h-48 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setPostImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  ×
                </button>
              </div>
            )}

            {/* Дополнительные опции */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Прикрепить фото */}
                <Label htmlFor="image-upload" className="group flex items-center gap-2 cursor-pointer hover-secondary rounded-lg px-3 h-8 text-sm transition-colors">
                  <ImageIcon className="w-4 h-4 text-muted-foreground group-hover:text-[#f2f2f2]" />
                  <span className="text-muted-foreground group-hover:text-[#f2f2f2]">Прикрепить фото</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                </Label>

                {/* Место и Открыто всем в одной строке */}
                <div className="flex items-center gap-2">
                  <div className="group flex items-center gap-2 hover-secondary rounded-lg px-3 h-8 text-sm transition-colors">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground group-hover:text-[#f2f2f2]" />
                    <Input
                      placeholder="Место"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={isLoading}
                      className="w-32 h-8 text-sm border-0 bg-transparent placeholder:text-muted-foreground focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>

              {/* Кнопка Опубликовать - справа */}
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

export default CreatePostBlock;
