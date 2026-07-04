import axios from "axios";
import type {
  EmotionResult,
  RecommendationResponse,
  FavoriteListResponse,
  ApiResponse,
} from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Detect emotion from a base64-encoded camera frame */
export async function detectEmotion(
  base64Image: string
): Promise<EmotionResult> {
  const response = await api.post<EmotionResult>("/emotion/detect", {
    image: base64Image,
  });
  return response.data;
}

/** Get cat image recommendations for a given emotion */
export async function getRecommendations(
  emotion: string,
  excludeIds: number[] = []
): Promise<RecommendationResponse> {
  const params: Record<string, string> = { emotion };
  if (excludeIds.length > 0) {
    params.exclude = excludeIds.join(",");
  }
  const response = await api.get<RecommendationResponse>("/recommendations", {
    params,
  });
  return response.data;
}

/** Get all saved favorites */
export async function getFavorites(): Promise<FavoriteListResponse> {
  const response = await api.get<FavoriteListResponse>("/favorites");
  return response.data;
}

/** Add an image to favorites */
export async function addFavorite(imageId: number): Promise<ApiResponse> {
  const response = await api.post<ApiResponse>("/favorites", {
    image_id: imageId,
  });
  return response.data;
}

/** Remove a favorite by its ID */
export async function removeFavorite(favoriteId: number): Promise<ApiResponse> {
  const response = await api.delete<ApiResponse>(`/favorites/${favoriteId}`);
  return response.data;
}

/** Health check */
export async function healthCheck(): Promise<{ status: string }> {
  const response = await api.get<{ status: string }>("/health");
  return response.data;
}
