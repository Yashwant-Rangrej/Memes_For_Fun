"""Core configuration for CatMood backend."""

import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    APP_NAME: str = "CatMood"
    APP_ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./catmood.db"
    MODEL_PATH: str = "models/"
    DATASET_PATH: str = "dataset/images"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def dataset_abs_path(self) -> Path:
        """Get absolute path to dataset directory."""
        return Path(__file__).parent.parent.parent / self.DATASET_PATH

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
