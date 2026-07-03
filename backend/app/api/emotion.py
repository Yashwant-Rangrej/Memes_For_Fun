"""Emotion detection API route."""

from fastapi import APIRouter

from app.schemas.emotion import EmotionRequest, EmotionResponse, EmotionErrorResponse
from app.services.emotion_service import detect_emotion

router = APIRouter(prefix="/emotion", tags=["Emotion"])


@router.post(
    "/detect",
    response_model=EmotionResponse | EmotionErrorResponse,
    summary="Detect facial emotion from image",
    description="Accepts a base64-encoded image and returns the detected emotion with confidence scores.",
)
async def detect_emotion_endpoint(request: EmotionRequest):
    """Detect emotion from a base64-encoded camera frame.

    The image should be captured from the user's webcam and sent
    as a base64-encoded string. The system will detect a face,
    analyze the expression, and return the dominant emotion.
    """
    result = detect_emotion(request.image)
    return result
