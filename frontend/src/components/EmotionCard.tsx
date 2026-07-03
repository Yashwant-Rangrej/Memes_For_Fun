interface EmotionCardProps {
  emotion: string;
  confidence: number;
  allEmotions?: Record<string, number>;
}

const EMOTION_EMOJI: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  fear: "😨",
  neutral: "😐",
  surprise: "😲",
  disgust: "🤢",
};

export function EmotionCard({
  emotion,
  confidence,
  allEmotions,
}: EmotionCardProps) {
  const emoji = EMOTION_EMOJI[emotion] || "🐱";
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="bg-card border border-border rounded-[var(--radius-card)] p-6 animate-fade-in">
      {/* Primary emotion */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl" role="img" aria-label={emotion}>
          {emoji}
        </span>
        <div>
          <h3 className="text-lg font-semibold capitalize text-foreground">
            {emotion}
          </h3>
          <p className="text-sm text-secondary">Detected emotion</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-secondary">Confidence</span>
          <span className="text-xs font-semibold text-foreground">
            {confidencePercent}%
          </span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-500 ease-out"
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* All emotions breakdown */}
      {allEmotions && (
        <div className="space-y-2 pt-4 border-t border-border">
          <p className="text-xs font-medium text-secondary mb-2">
            All predictions
          </p>
          {Object.entries(allEmotions)
            .sort(([, a], [, b]) => b - a)
            .map(([em, score]) => (
              <div key={em} className="flex items-center gap-2">
                <span className="text-xs w-16 capitalize text-secondary">
                  {em}
                </span>
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary/50 rounded-full"
                    style={{ width: `${Math.round(score * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-secondary w-8 text-right">
                  {Math.round(score * 100)}%
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
