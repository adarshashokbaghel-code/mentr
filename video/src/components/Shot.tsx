import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { theme } from "../theme";

export type Crop = {
  /** object-position style focus */
  x?: string;
  y?: string;
  scale?: number;
};

/**
 * One editorial "angle" of a screen recording — full / mid / tight crop.
 */
export const Shot: React.FC<{
  src: string;
  startFrom?: number;
  crop?: Crop;
  zoomFrom?: number;
  zoomTo?: number;
  caption?: string;
  captionDelay?: number;
  flashIn?: boolean;
}> = ({
  src,
  startFrom = 0,
  crop,
  zoomFrom = 1.0,
  zoomTo = 1.08,
  caption,
  captionDelay = 4,
  flashIn = true,
}) => {
  const frame = useCurrentFrame();
  const baseScale = crop?.scale ?? 1;
  const zoom =
    baseScale *
    interpolate(frame, [0, 70], [zoomFrom, zoomTo], {
      extrapolateRight: "clamp",
    });
  const opacity = flashIn
    ? interpolate(frame, [0, 4], [0, 1], { extrapolateRight: "clamp" })
    : 1;
  const capOpacity = caption
    ? interpolate(frame, [captionDelay, captionDelay + 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden", opacity }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: `${crop?.x ?? "50%"} ${crop?.y ?? "40%"}`,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={Math.round(startFrom * 30)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${crop?.x ?? "center"} ${crop?.y ?? "top"}`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,7,0.25) 0%, transparent 18%, transparent 58%, rgba(5,6,7,0.82) 100%)",
          pointerEvents: "none",
        }}
      />
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 56,
            opacity: capOpacity,
            fontFamily: theme.font,
            color: theme.ink,
            fontSize: 38,
            fontWeight: 750,
            letterSpacing: "-0.01em",
            textShadow: "0 12px 40px rgba(0,0,0,0.7)",
            maxWidth: 1200,
          }}
        >
          {caption}
          <div
            style={{
              marginTop: 10,
              height: 3,
              width: 64,
              background: theme.gold,
              borderRadius: 99,
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
