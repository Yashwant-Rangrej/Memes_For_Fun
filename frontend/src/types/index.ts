/* ===== Shared TypeScript types for CatMood ===== */

/** Result from the emotion detection API */
export interface EmotionResult {
  success: boolean;
  emotion: string;
  confidence: number;
  all_emotions: Record<string, number>;
  message?: string;
}

/** A single cat reaction image */
export interface CatImage {
  id: number;
  filename: string;
  emotion: string;
  url: string;
}

/** Response from the recommendations API */
export interface RecommendationResponse {
  emotion: string;
  total: number;
  images: CatImage[];
}

/** A saved favorite */
export interface Favorite {
  id: number;
  image_id: number;
  filename: string;
  emotion: string;
  url: string;
  created_at: string;
}

/** Response from the favorites list API */
export interface FavoriteListResponse {
  total: number;
  favorites: Favorite[];
}

/** Generic API success/error response */
export interface ApiResponse {
  success: boolean;
  message?: string;
  id?: number;
}
