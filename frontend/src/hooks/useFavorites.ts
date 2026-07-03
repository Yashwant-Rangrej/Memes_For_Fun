"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "@/services/api";
import type { Favorite } from "@/types";

interface UseFavoritesReturn {
  favorites: Favorite[];
  favoriteImageIds: Set<number>;
  favoriteMap: Map<number, number>; // imageId -> favoriteId
  isLoading: boolean;
  error: string | null;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (imageId: number) => Promise<void>;
  removeFav: (favoriteId: number) => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived sets for quick lookups
  const favoriteImageIds = new Set(favorites.map((f) => f.image_id));
  const favoriteMap = new Map(
    favorites.map((f) => [f.image_id, f.id])
  );

  const loadFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getFavorites();
      setFavorites(response.favorites);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load favorites.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (imageId: number) => {
      try {
        if (favoriteImageIds.has(imageId)) {
          const favId = favoriteMap.get(imageId);
          if (favId) {
            await removeFavorite(favId);
            setFavorites((prev) => prev.filter((f) => f.id !== favId));
          }
        } else {
          await addFavorite(imageId);
          // Reload to get full favorite data
          await loadFavorites();
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update favorites.";
        setError(message);
      }
    },
    [favoriteImageIds, favoriteMap, loadFavorites]
  );

  const removeFav = useCallback(async (favoriteId: number) => {
    try {
      await removeFavorite(favoriteId);
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to remove favorite.";
      setError(message);
    }
  }, []);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    favoriteImageIds,
    favoriteMap,
    isLoading,
    error,
    loadFavorites,
    toggleFavorite,
    removeFav,
  };
}
