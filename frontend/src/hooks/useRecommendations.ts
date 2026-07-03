"use client";

import { useState, useCallback } from "react";
import { getRecommendations } from "@/services/api";
import type { CatImage } from "@/types";

interface UseRecommendationsReturn {
  images: CatImage[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: (emotion: string) => Promise<void>;
  refresh: (emotion: string) => Promise<void>;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [images, setImages] = useState<CatImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousIds, setPreviousIds] = useState<number[]>([]);

  const fetchRecommendations = useCallback(async (emotion: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRecommendations(emotion);
      setImages(response.images);
      setPreviousIds(response.images.map((img) => img.id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load recommendations.";
      setError(message);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(
    async (emotion: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getRecommendations(emotion, previousIds);
        setImages(response.images);
        setPreviousIds((prev) => [
          ...prev,
          ...response.images.map((img) => img.id),
        ]);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to refresh recommendations.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [previousIds]
  );

  return { images, isLoading, error, fetchRecommendations, refresh };
}
