"use client";

import { ImageCard } from "./ImageCard";

interface CatImage {
  id: number;
  filename: string;
  emotion: string;
  url: string;
}

interface RecommendationGridProps {
  images: CatImage[];
  favoriteImageIds: Set<number>;
  favoriteMap: Map<number, number>; // imageId -> favoriteId
  onFavorite: (imageId: number) => void;
  onUnfavorite: (favoriteId: number) => void;
}

export function RecommendationGrid({
  images,
  favoriteImageIds,
  favoriteMap,
  onFavorite,
  onUnfavorite,
}: RecommendationGridProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-secondary text-sm">No matching images found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <ImageCard
            id={image.id}
            filename={image.filename}
            emotion={image.emotion}
            url={image.url}
            isFavorited={favoriteImageIds.has(image.id)}
            favoriteId={favoriteMap.get(image.id)}
            onFavorite={onFavorite}
            onUnfavorite={onUnfavorite}
          />
        </div>
      ))}
    </div>
  );
}
