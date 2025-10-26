import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FileText, Trophy, Building, Megaphone } from 'lucide-react';

interface MobileCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
}

const MobileCreateModal: React.FC<MobileCreateModalProps> = ({ isOpen, onClose, isAuthenticated = true }) => {
  const navigate = useNavigate();

  const handleCreate = (type: string) => {
    navigate(`/u/?create=${type}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-end md:hidden"
      onClick={onClose}
    >
      <div 
        className="w-full bg-background rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Создать</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Кнопки создания или сообщение для неавторизованных */}
        {isAuthenticated ? (
          <div className="grid grid-cols-2 gap-4">
            {/* Создать пост */}
            <button
              onClick={() => handleCreate('post')}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors border border-border"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                Создать пост
              </span>
            </button>

            {/* Создать конкурс */}
            <button
              onClick={() => handleCreate('contest')}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors border border-border"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                Создать конкурс
              </span>
            </button>

            {/* Создать клуб */}
            <button
              onClick={() => handleCreate('club')}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors border border-border"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                Создать клуб
              </span>
            </button>

            {/* Создать объявление на Доске Тренеров */}
            <button
              onClick={() => handleCreate('coach-announcement')}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors border border-border"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground text-center">
                Объявление на Доске Тренеров
              </span>
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Войдите в аккаунт
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Чтобы создавать посты, клубы и другие материалы, необходимо войти в аккаунт
            </p>
            <button
              onClick={() => navigate('/volt-login')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Войти в аккаунт
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCreateModal;
