import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FavoritesManager } from '@/utils/favorites';

interface FavoriteButtonProps {
  toolPath: string;
  toolName: string;
}

export function FavoriteButton({ toolPath, toolName }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAtMax, setIsAtMax] = useState(false);

  useEffect(() => {
    setIsFavorite(FavoritesManager.isFavorite(toolPath));
    setIsAtMax(FavoritesManager.isAtMaxCapacity());
  }, [toolPath]);

  const handleToggle = () => {
    const newState = FavoritesManager.toggle(toolPath);
    setIsFavorite(newState);
    setIsAtMax(FavoritesManager.isAtMaxCapacity());
  };

  const canAdd = !isFavorite && !isAtMax;

  return (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggle}
      disabled={!isFavorite && isAtMax}
      className="gap-2"
      title={
        isFavorite
          ? `Remove ${toolName} from favorites`
          : isAtMax
          ? 'Maximum favorites reached'
          : `Add ${toolName} to favorites`
      }
    >
      <Star
        className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
      />
      <span className="hidden sm:inline">
        {isFavorite ? 'Saved' : canAdd ? 'Save' : 'Max reached'}
      </span>
    </Button>
  );
}
