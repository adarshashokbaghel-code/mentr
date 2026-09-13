"use client";

import { MentorPhoto } from "@/components/ui/mentor-photo";
import { ApiError, profileApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Trash2,
  X,
  ZoomIn,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

type ProfileImageUploaderProps = {
  name?: string;
  initials?: string;
  imageUrl?: string | null;
  onUploaded: (url: string | null) => void;
  className?: string;
};

async function cropToJpeg(
  imageSrc: string,
  crop: Area,
  size = 640,
): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    size,
    size,
  );

  return canvas.toDataURL("image/jpeg", 0.88);
}

export function ProfileImageUploader({
  name = "",
  initials,
  imageUrl,
  onUploaded,
  className,
}: ProfileImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl || null);
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreviewUrl(imageUrl || null);
  }, [imageUrl]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedArea(pixels);
  }, []);

  function openPicker() {
    setError("");
    inputRef.current?.click();
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setError("Use a JPEG, PNG, or WebP image");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Pick an image under 8 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRawSrc(String(reader.result || ""));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
  }

  async function saveCrop() {
    if (!rawSrc || !croppedArea) return;
    setSaving(true);
    setError("");
    try {
      const dataUrl = await cropToJpeg(rawSrc, croppedArea);
      const { profileImageUrl, user } = await profileApi.uploadImage(dataUrl);
      const next = profileImageUrl || user.profileImageUrl || null;
      setPreviewUrl(next);
      onUploaded(next);
      setRawSrc(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not upload photo",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removePhoto() {
    setRemoving(true);
    setError("");
    try {
      await profileApi.deleteImage();
      setPreviewUrl(null);
      onUploaded(null);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not remove photo",
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-4">
        <MentorPhoto
          name={name}
          initials={initials}
          imageUrl={previewUrl}
          size="xl"
          rounded="2xl"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-semibold text-ink">Profile photo</p>
          <p className="text-xs leading-relaxed text-muted">
            Square crop works best. Parents trust listings with a real face —
            optional, but worth it.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openPicker}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline bg-white px-3 text-[13px] font-semibold text-ink transition hover:bg-cream"
            >
              <Camera className="h-3.5 w-3.5" />
              {previewUrl ? "Change photo" : "Upload photo"}
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={removePhoto}
                disabled={removing}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-coral/30 bg-coral-wash px-3 text-[13px] font-semibold text-coral-dark transition hover:opacity-90 disabled:opacity-60"
              >
                {removing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Remove photo
              </button>
            )}
          </div>
          {previewUrl && (
            <p className="text-[11px] text-muted">
              Remove deletes the file from storage and clears it on your listing.
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="flex items-center gap-2 rounded-lg border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
          <X className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      {rawSrc && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-hairline bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <ImagePlus className="h-4 w-4 text-coral" />
                Crop photo
              </p>
              <button
                type="button"
                onClick={() => setRawSrc(null)}
                className="rounded-md p-1 text-muted hover:bg-cream hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative h-72 bg-ink/90">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="space-y-3 px-4 py-3">
              <label className="flex items-center gap-3 text-xs font-medium text-muted">
                <ZoomIn className="h-3.5 w-3.5 shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-coral"
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRawSrc(null)}
                  className="h-10 flex-1 rounded-md border border-hairline text-sm font-semibold text-ink hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveCrop}
                  disabled={saving || !croppedArea}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-md bg-coral text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Save photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
