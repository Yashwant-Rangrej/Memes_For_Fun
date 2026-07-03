"use client";

import { useState } from "react";
import { Button } from "./Button";

interface ImageCardProps {
  id: number;
  filename: string;
  emotion: string;
  url: string;
  isFavorited?: boolean;
  onFavorite?: (imageId: number) => void;
  onUnfavorite?: (imageId: number) => void;
  favoriteId?: number;
}

export function ImageCard({
  id,
  filename,
  emotion,
  url,
  isFavorited = false,
  onFavorite,
  onUnfavorite,
  favoriteId,
}: ImageCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const baseUrl = apiUrl.replace(/\/api\/v1\/?$/, "");
  const imageUrl = `${baseUrl}${url}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleShareWhatsAppSticker = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const img = new window.Image();
      const objectUrl = window.URL.createObjectURL(blob);
      img.src = objectUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.clearRect(0, 0, 512, 512);
        
        const scale = Math.min(512 / img.width, 512 / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (512 - w) / 2;
        const y = (512 - h) / 2;
        
        ctx.drawImage(img, x, y, w, h);
        
        canvas.toBlob(async (webpBlob) => {
          if (webpBlob) {
            const file = new File([webpBlob], `${emotion}_sticker.webp`, { type: "image/webp" });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  title: `${emotion} sticker`,
                  files: [file],
                });
              } catch (shareErr) {
                console.error("Error sharing:", shareErr);
              }
            } else {
              const downloadUrl = window.URL.createObjectURL(webpBlob);
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.download = `${emotion}_sticker.webp`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(downloadUrl);
              alert("Sticker downloaded! You can now send it in WhatsApp.");
            }
          }
        }, "image/webp");
      }
      
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to process sticker:", err);
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorited && onUnfavorite && favoriteId) {
      onUnfavorite(favoriteId);
    } else if (!isFavorited && onFavorite) {
      onFavorite(id);
    }
  };

  return (
    <div
      className="group bg-card border border-border rounded-[var(--radius-card)] overflow-hidden transition-default animate-fade-in"
      style={{
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: isHovered ? "0 4px 6px -1px rgba(0,0,0,0.05)" : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-border/30">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-secondary text-sm">
            <span>Image unavailable</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${emotion} cat reaction`}
            className="w-full h-full object-cover transition-default"
            style={{
              transform: isHovered ? "scale(1.03)" : "scale(1)",
            }}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </div>

      {/* Info & Actions */}
      <div className="p-3">
        {/* Emotion tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-foreground text-background rounded-full capitalize">
            {emotion}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
              aria-label={`Download ${filename}`}
            >
              ↓ Download
            </Button>
            <Button
              variant={isFavorited ? "danger" : "secondary"}
              size="sm"
              onClick={handleFavoriteToggle}
              aria-label={
                isFavorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorited ? "♥" : "♡"}
            </Button>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShareWhatsAppSticker}
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent flex items-center justify-center gap-2"
            aria-label="Share as WhatsApp Sticker"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            WA Sticker
          </Button>
        </div>
      </div>
    </div>
  );
}
