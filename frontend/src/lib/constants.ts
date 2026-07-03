/** API base URL for the backend */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Supported emotion categories */
export const EMOTIONS = [
  "happy",
  "sad",
  "angry",
  "fear",
  "neutral",
  "surprise",
  "disgust",
] as const;

export type Emotion = (typeof EMOTIONS)[number];

/** Emoji mapping for each emotion */
export const EMOTION_EMOJI: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fear: "😨",
  neutral: "😐",
  surprise: "😲",
  disgust: "🤢",
};

/** Number of images per recommendation */
export const RECOMMENDATION_COUNT = 5;

/** Camera constraints */
export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: "user",
  },
  audio: false,
};
