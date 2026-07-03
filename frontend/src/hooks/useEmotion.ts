"use client";

import { useState, useCallback } from "react";
import { detectEmotion } from "@/services/api";
import type { EmotionResult } from "@/types";

interface UseEmotionReturn {
  result: EmotionResult | null;
  isLoading: boolean;
  error: string | null;
  analyze: (base64Image: string) => Promise<EmotionResult | null>;
  reset: () => void;
}

export function useEmotion(): UseEmotionReturn {
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (base64Image: string): Promise<EmotionResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await detectEmotion(base64Image);

        if (response.success) {
          setResult(response);
          return response;
        } else {
          setError(response.message || "Unable to detect emotion.");
          setResult(null);
          return null;
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Try again.";
        setError(message);
        setResult(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { result, isLoading, error, analyze, reset };
}
