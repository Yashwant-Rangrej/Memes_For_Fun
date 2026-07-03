"""Emotion detection service using DeepFace."""

import base64
import logging

import cv2
import numpy as np
from deepface import DeepFace

logger = logging.getLogger(__name__)

# Valid emotions supported by the system
VALID_EMOTIONS = ["happy", "sad", "angry", "fear", "neutral", "surprise", "disgust"]


def decode_base64_image(base64_string: str) -> np.ndarray:
    """Decode a base64 string into an OpenCV image (NumPy array).

    Handles data URI prefixes like 'data:image/jpeg;base64,...'
    """
    # Strip data URI prefix if present
    if "," in base64_string:
        base64_string = base64_string.split(",", 1)[1]

    img_bytes = base64.b64decode(base64_string)
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Failed to decode image from base64 string.")

    return img


def detect_emotion(base64_image: str) -> dict:
    """Detect facial emotion from a base64-encoded image.

    Args:
        base64_image: Base64-encoded image string (optionally with data URI prefix).

    Returns:
        Dictionary with detection results:
        - success: bool
        - emotion: str (dominant emotion)
        - confidence: float (0-1)
        - all_emotions: dict mapping emotion names to confidence scores
        - message: str (only on failure)
    """
    try:
        img = decode_base64_image(base64_image)
    except Exception as e:
        logger.error(f"Image decode error: {e}")
        return {"success": False, "message": "Invalid image data."}

    try:
        results = DeepFace.analyze(
            img_path=img,
            actions=["emotion"],
            enforce_detection=True,
            detector_backend="mtcnn",
            silent=True,
        )
    except ValueError as e:
        error_msg = str(e).lower()
        if "face" in error_msg and ("could not" in error_msg or "no" in error_msg):
            return {"success": False, "message": "No face detected."}
        logger.error(f"DeepFace ValueError: {e}")
        return {"success": False, "message": "Unable to detect emotion."}
    except Exception as e:
        logger.error(f"DeepFace error: {e}")
        return {"success": False, "message": "Unable to detect emotion. Try again."}

    # Handle single or multiple face detections
    if isinstance(results, list):
        if len(results) == 0:
            return {"success": False, "message": "No face detected."}
        if len(results) > 1:
            return {
                "success": False,
                "message": "Multiple faces detected. Please face the camera alone.",
            }
        result = results[0]
    else:
        result = results

    # Extract emotion data
    emotion_scores = result.get("emotion", {})
    dominant_emotion = result.get("dominant_emotion", "neutral")

    # Normalize scores to 0-1 range (DeepFace returns percentages)
    all_emotions = {}
    for emotion in VALID_EMOTIONS:
        score = emotion_scores.get(emotion, 0.0)
        all_emotions[emotion] = round(score / 100.0, 4)

    confidence = all_emotions.get(dominant_emotion, 0.0)

    return {
        "success": True,
        "emotion": dominant_emotion,
        "confidence": round(confidence, 4),
        "all_emotions": all_emotions,
    }
