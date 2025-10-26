import React from 'react';

interface PhotoGalleryProps {
  photos: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  // Если фото меньше 7, дублируем их
  const displayPhotos = photos.length >= 7 
    ? photos.slice(0, 7) 
    : [...photos, ...photos.slice(0, 7 - photos.length)];

  return (
    <div className="flex items-center justify-center gap-0 mb-6 animate-fade-in photo-gallery">
      {displayPhotos.map((photo, index) => {
        // Определяем размеры: центральное фото самое большое, остальные уменьшаются к краям
        const isCenter = index === 3; // 4-е фото (индекс 3) - центральное
        const distanceFromCenter = Math.abs(index - 3);
        
        let sizeClass = '';
        let widthClass = '';
        
        if (isCenter) {
          sizeClass = 'w-32 h-32'; // Центральное фото - самое большое
          widthClass = 'w-32';
        } else if (distanceFromCenter === 1) {
          sizeClass = 'w-28 h-28'; // Соседние с центральным
          widthClass = 'w-28';
        } else if (distanceFromCenter === 2) {
          sizeClass = 'w-24 h-24'; // Предпоследние
          widthClass = 'w-24';
        } else {
          sizeClass = 'w-20 h-20'; // Крайние фото - самые маленькие
          widthClass = 'w-20';
        }

        return (
          <div
            key={index}
            className={`${sizeClass} rounded-full overflow-hidden transition-all duration-300 hover:scale-110 relative z-${10 - distanceFromCenter}`}
            style={{ marginLeft: index > 0 ? '-8px' : '0' }}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className={`${widthClass} h-full object-cover`}
              onError={(e) => {
                // Fallback на placeholder если фото не загрузилось
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAyMEMzNi40MTgzIDIwIDQwIDE2LjQxODMgNDAgMTJDNDAgNy41ODE3MiAzNi40MTgzIDQgMzIgNEMyNy41ODE3IDQgMjQgNy41ODE3MiAyNCAxMkMyNCAxNi40MTgzIDI3LjU4MTcgMjAgMzIgMjBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNiA1MkMxNiA0Ni40NzcgMjAuNDc3IDQyIDI2IDQySDM4QzQzLjUyMyA0MiA0OCA0Ni40NzcgNDggNTJWNTJIMTZaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PhotoGallery;
