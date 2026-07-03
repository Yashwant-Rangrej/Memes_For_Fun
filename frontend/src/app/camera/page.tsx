"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCamera } from "@/hooks/useCamera";
import { useEmotion } from "@/hooks/useEmotion";
import { EmotionCard } from "@/components/EmotionCard";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";

export default function CameraPage() {
  const router = useRouter();
  const { videoRef, canvasRef, isReady, error: cameraError, startCamera, stopCamera, captureFrame } = useCamera();
  const { result, isLoading, error: emotionError, analyze, reset } = useEmotion();
  const [isCameraStarted, setIsCameraStarted] = useState(false);

  const handleStartCamera = async () => {
    await startCamera();
    setIsCameraStarted(true);
  };

  const handleCapture = async () => {
    const frame = captureFrame();
    if (!frame) return;
    await analyze(frame);
  };

  const handleViewRecommendations = () => {
    if (result) {
      // Store result in sessionStorage for the recommendations page
      sessionStorage.setItem("emotionResult", JSON.stringify(result));
      stopCamera();
      router.push(`/recommendations?emotion=${result.emotion}`);
    }
  };

  const handleRetry = () => {
    reset();
  };

  const currentError = cameraError || emotionError;

  return (
    <div className="container-app py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Emotion Detection
          </h1>
          <p className="text-sm text-secondary">
            {!isCameraStarted
              ? "Start your camera to begin"
              : isReady && !result
              ? "Position your face in the frame and capture"
              : result
              ? "Emotion detected! View your cat reactions."
              : "Setting up camera..."}
          </p>
        </div>

        {/* Camera Preview */}
        <div className="relative mb-6">
          <div className="relative aspect-video bg-card border border-border rounded-[var(--radius-card)] overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover camera-video"
              autoPlay
              playsInline
              muted
            />
            {!isCameraStarted ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card">
                <div className="text-4xl">📷</div>
                <p className="text-sm text-secondary">Camera preview</p>
                <Button onClick={handleStartCamera}>Start Camera</Button>
              </div>
            ) : (
              !isReady && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                  <Loader text="Starting camera..." />
                </div>
              )
            )}
          </div>

          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Error display */}
        {currentError && (
          <div className="mb-6 p-4 bg-card border border-danger/20 rounded-[var(--radius-card)] text-sm text-danger animate-fade-in">
            {currentError}
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="mb-6">
            <Loader text="Analyzing your expression..." />
          </div>
        )}

        {/* Emotion result */}
        {result && (
          <div className="mb-6">
            <EmotionCard
              emotion={result.emotion}
              confidence={result.confidence}
              allEmotions={result.all_emotions}
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          {isReady && !result && !isLoading && (
            <Button onClick={handleCapture} size="lg">
              Capture &amp; Detect
            </Button>
          )}

          {result && (
            <>
              <Button onClick={handleViewRecommendations} size="lg">
                View Cat Reactions →
              </Button>
              <Button variant="secondary" size="lg" onClick={handleRetry}>
                Try Again
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
