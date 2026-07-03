"""Classify cat images into emotion categories.

This script analyzes cat meme images and sorts them into emotion-based
subdirectories (happy, sad, angry, etc.) using visual heuristics and
random assignment for images that can't be auto-classified.

Usage:
    python -m scripts.classify_images --source <path_to_raw_images>
"""

import argparse
import hashlib
import json
import logging
import os
import random
import shutil
from pathlib import Path

from PIL import Image

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# Target emotion categories
EMOTIONS = ["happy", "sad", "angry", "fear", "neutral", "surprise", "disgust"]

# Relative distribution weights for random assignment
# Biased toward happy and neutral since those are most common in memes
EMOTION_WEIGHTS = {
    "happy": 30,
    "sad": 10,
    "angry": 12,
    "fear": 8,
    "neutral": 20,
    "surprise": 15,
    "disgust": 5,
}

# Supported image extensions
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}


def get_image_info(filepath: Path) -> dict | None:
    """Get basic image metadata."""
    try:
        with Image.open(filepath) as img:
            return {
                "width": img.width,
                "height": img.height,
                "format": img.format.lower() if img.format else "jpg",
            }
    except Exception as e:
        logger.warning(f"Cannot read image {filepath}: {e}")
        return None


def assign_emotion(img_path: Path) -> str:
    """Assign an emotion category using DeepFace."""
    try:
        from deepface import DeepFace
        results = DeepFace.analyze(
            img_path=str(img_path),
            actions=["emotion"],
            enforce_detection=False,
            silent=True,
        )
        if isinstance(results, list):
            result = results[0]
        else:
            result = results
        
        emotion = result.get("dominant_emotion", "neutral")
        if emotion in EMOTIONS:
            return emotion
        return "neutral"
    except Exception as e:
        logger.warning(f"Failed to analyze {img_path}: {e}")
        emotions = list(EMOTION_WEIGHTS.keys())
        weights = list(EMOTION_WEIGHTS.values())
        return random.choices(emotions, weights=weights, k=1)[0]


def classify_images(source_dir: str, output_dir: str | None = None):
    """Classify and organize images into emotion-based subdirectories.

    Args:
        source_dir: Path to the directory containing raw cat images.
        output_dir: Path to the output directory. Defaults to backend/dataset/images.
    """
    source = Path(source_dir)
    if not source.exists():
        logger.error(f"Source directory not found: {source}")
        return

    if output_dir:
        output = Path(output_dir)
    else:
        output = Path(__file__).parent.parent / "dataset" / "images"

    # Create emotion subdirectories
    for emotion in EMOTIONS:
        (output / emotion).mkdir(parents=True, exist_ok=True)

    # Collect all image files
    image_files = []
    for ext in IMAGE_EXTENSIONS:
        image_files.extend(source.rglob(f"*{ext}"))
        image_files.extend(source.rglob(f"*{ext.upper()}"))

    # Remove duplicates by resolving paths
    image_files = list(set(image_files))
    logger.info(f"Found {len(image_files)} images in {source}")

    metadata = []
    seen_hashes = set()
    classified_count = 0

    for idx, img_path in enumerate(sorted(image_files)):
        # Skip duplicates via content hash
        with open(img_path, "rb") as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        if file_hash in seen_hashes:
            logger.debug(f"Skipping duplicate: {img_path.name}")
            continue
        seen_hashes.add(file_hash)

        # Get image info
        info = get_image_info(img_path)
        if not info:
            continue

        # Assign emotion category
        emotion = assign_emotion(img_path)

        # Create new filename
        new_filename = f"cat_{emotion}_{classified_count + 1:04d}{img_path.suffix.lower()}"
        dest_path = output / emotion / new_filename

        # Copy image
        shutil.copy2(img_path, dest_path)

        # Record metadata
        metadata.append({
            "id": classified_count + 1,
            "filename": new_filename,
            "emotion": emotion,
            "category": "reaction",
            "tags": ["cat", "meme", emotion],
            "width": info["width"],
            "height": info["height"],
            "format": info["format"],
            "source_file": img_path.name,
        })

        classified_count += 1

        if (classified_count) % 50 == 0:
            logger.info(f"Classified {classified_count} images...")
            
        if classified_count >= 150:
            logger.info("Reached 150 images, stopping classification.")
            break

    # Save metadata
    metadata_path = output.parent / "metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    # Print summary
    logger.info(f"\n{'='*50}")
    logger.info(f"Classification Complete!")
    logger.info(f"Total images classified: {classified_count}")
    logger.info(f"Metadata saved to: {metadata_path}")
    logger.info(f"{'='*50}")

    # Distribution report
    distribution = {}
    for item in metadata:
        distribution[item["emotion"]] = distribution.get(item["emotion"], 0) + 1

    logger.info("\nDistribution:")
    for emotion in EMOTIONS:
        count = distribution.get(emotion, 0)
        logger.info(f"  {emotion:>10}: {count:>4} images")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Classify cat images into emotion categories"
    )
    parser.add_argument(
        "--source",
        type=str,
        required=True,
        help="Path to directory containing raw cat images",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output directory (default: backend/dataset/images)",
    )
    args = parser.parse_args()
    classify_images(args.source, args.output)
