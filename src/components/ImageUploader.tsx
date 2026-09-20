"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Loader2, Link as LinkIcon } from "lucide-react";
import { apiUrl, parseJsonResponse } from "@/lib/api";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  token?: string;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  token,
  label = "Upload Image (ImgBB CDN)",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress and downscale image on canvas for fast rendering & smaller upload size
  const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Downscale dimensions maintaining aspect ratio
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG base64
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const uploadFileToImgBB = async (file: File) => {
    setIsUploading(true);
    setError(null);

    if (!token) {
      setError("Please log in before uploading an image.");
      setIsUploading(false);
      return;
    }

    try {
      // 1. Compress Image File before Upload
      const base64 = await compressImage(file, 1200, 1200, 0.75);

      let uploadedUrl: string | null = null;

      // 2. Try Backend API first (/api/upload)
      try {
        const res = await fetch(apiUrl("/api/upload"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await parseJsonResponse<{ url?: string; message?: string }>(res);
        if (!res.ok) {
          throw new Error(data.message || `Image upload failed (${res.status}).`);
        }
        if (data.url) {
          uploadedUrl = data.url;
        }
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : "Image upload failed.";
        setError(message);
        return;
      }

      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        setError("The API did not return an image URL. Check its IMGBB_API_KEY configuration.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "An error occurred while uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadFileToImgBB(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrlInput ? "Upload File" : "Paste URL instead"}
        </button>
      </div>

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 max-h-48 flex items-center justify-center p-2 group">
          <img
            src={value}
            alt="Uploaded preview"
            className="max-h-44 rounded-xl object-contain"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 hover:text-white hover:bg-rose-900 transition-all shadow-lg"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : showUrlInput ? (
        /* URL Input Fallback */
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.png"
          className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      ) : (
        /* File Upload Drop Zone / Button */
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-900/60 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Uploading to ImgBB CDN...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Choose Image File (JPG, PNG, WebP)</span>
              </>
            )}
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-[11px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
