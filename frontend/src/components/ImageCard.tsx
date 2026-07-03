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
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent"
            aria-label="Share as WhatsApp Sticker"
          >
            Share as WA Sticker
          </Button>
        </div>
      </div>
    </div>
  );
}
