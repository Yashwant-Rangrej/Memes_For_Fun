"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { ImageCard } from "@/components/ImageCard";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/Button";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, isLoading, error, removeFav } = useFavorites();

  const handleUnfavorite = async (favoriteId: number) => {
    await removeFav(favoriteId);
  };

  return (
    <div className="container-app py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Favorites
        </h1>
        <p className="text-sm text-secondary">
          Your saved cat reactions
        </p>
      </div>

      {/* Loading */}
      {isLoading && <Loader text="Loading favorites..." />}

      {/* Error */}
      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && favorites.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">♡</p>
          <p className="text-sm text-secondary mb-6">
            No favorites yet. Start detecting emotions and save the cats you love.
          </p>
          <Link href="/camera">
            <Button>Start Camera</Button>
          </Link>
        </div>
      )}

      {/* Favorites grid */}
      {!isLoading && !error && favorites.length > 0 && (
        <>
          <p className="text-xs text-secondary mb-6 text-center">
            {favorites.length} saved {favorites.length === 1 ? "image" : "images"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((fav, index) => (
              <div
                key={fav.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ImageCard
                  id={fav.image_id}
                  filename={fav.filename}
                  emotion={fav.emotion}
                  url={fav.url}
                  isFavorited={true}
                  favoriteId={fav.id}
                  onUnfavorite={handleUnfavorite}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
