"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RecommendationGrid } from "@/components/RecommendationGrid";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useFavorites } from "@/hooks/useFavorites";

const EMOTION_EMOJI: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fear: "😨",
  neutral: "😐",
  surprise: "😲",
  disgust: "🤢",
};

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const emotion = searchParams.get("emotion") || "happy";
  const emoji = EMOTION_EMOJI[emotion] || "🐱";

  const {
    images,
    isLoading,
    error,
    fetchRecommendations,
    refresh,
  } = useRecommendations();

  const {
    favoriteImageIds,
    favoriteMap,
    toggleFavorite,
    removeFav,
  } = useFavorites();

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      fetchRecommendations(emotion);
      setHasLoaded(true);
    }
  }, [emotion, fetchRecommendations, hasLoaded]);

  const handleRefresh = () => {
    refresh(emotion);
  };

  const handleFavorite = async (imageId: number) => {
    await toggleFavorite(imageId);
  };

  const handleUnfavorite = async (favoriteId: number) => {
    await removeFav(favoriteId);
  };

  return (
    <div className="container-app py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-4xl mb-2 block">{emoji}</span>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Feeling{" "}
          <span className="capitalize">{emotion}</span>?
        </h1>
        <p className="text-sm text-secondary">
          Here are your matching cat reactions
        </p>
      </div>

      {/* Loading */}
      {isLoading && <Loader text="Finding the perfect cats..." />}

      {/* Error */}
      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-danger mb-4">{error}</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      )}

      {/* Recommendations grid */}
      {!isLoading && !error && (
        <>
          <RecommendationGrid
            images={images}
            favoriteImageIds={favoriteImageIds}
            favoriteMap={favoriteMap}
            onFavorite={handleFavorite}
            onUnfavorite={handleUnfavorite}
          />

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button onClick={handleRefresh} variant="secondary" size="lg">
              ↻ Refresh
            </Button>
            <Link href="/camera">
              <Button size="lg">← Try Again</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  return (
    <Suspense fallback={<Loader text="Loading..." />}>
      <RecommendationsContent />
    </Suspense>
  );
}
