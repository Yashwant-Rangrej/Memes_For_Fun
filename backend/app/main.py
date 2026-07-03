"""CatMood — FastAPI Backend Application.

AI-powered funny cat reaction recommendation system.
Detects facial emotions and recommends matching cat images.
"""

import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

class CORSStaticFiles(StaticFiles):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def __call__(self, scope, receive, send):
        async def respond(message):
            if message["type"] == "http.response.start":
                headers = message.setdefault("headers", [])
                headers.append((b"access-control-allow-origin", b"*"))
            await send(message)
        await super().__call__(scope, receive, respond)

from app.api import emotion, favorites, health, recommendation
from app.core.config import settings
from app.core.database import init_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler — runs on startup and shutdown."""
    # Startup
    logger.info(f"Starting {settings.APP_NAME} backend...")
    init_db()
    logger.info("Database initialized.")

    # Mount dataset images as static files
    dataset_path = settings.dataset_abs_path
    if dataset_path.exists():
        app.mount(
            "/dataset/images",
            CORSStaticFiles(directory=str(dataset_path)),
            name="dataset_images",
        )
        logger.info(f"Serving dataset images from: {dataset_path}")
    else:
        logger.warning(f"Dataset path not found: {dataset_path}")
        # Create the directory structure
        for emotion_dir in [
            "happy", "sad", "angry", "fear",
            "neutral", "surprise", "disgust",
        ]:
            (dataset_path / emotion_dir).mkdir(parents=True, exist_ok=True)
        logger.info(f"Created dataset directory structure at: {dataset_path}")
        app.mount(
            "/dataset/images",
            CORSStaticFiles(directory=str(dataset_path)),
            name="dataset_images",
        )

    yield

    # Shutdown
    logger.info(f"Shutting down {settings.APP_NAME} backend.")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-powered funny cat reaction recommendation system. "
        "Detects facial emotions from webcam and recommends matching cat images."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes under /api/v1
app.include_router(health.router, prefix="/api/v1")
app.include_router(emotion.router, prefix="/api/v1")
app.include_router(recommendation.router, prefix="/api/v1")
app.include_router(favorites.router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint."""
    return {
        "app": settings.APP_NAME,
        "version": "0.1.0",
        "docs": "/docs",
    }
