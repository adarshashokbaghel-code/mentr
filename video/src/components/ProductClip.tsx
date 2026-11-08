import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { theme } from "../theme";

export const ProductClip: React.FC<{
  src: string;
  /** Start time inside the source clip (seconds) */
  startFrom?: number;
  /** Subtle push-in */
  zoomFrom?: number;
  zoomTo?: number;
  /** Darken edges for text readability */
  vignette?: boolean;
  /** Lower-third caption */
  caption?: string;
  captionDelay?: number;
}> = ({
  src,
  startFrom = 0,
  zoomFrom = 1.02,
  zoomTo = 1.08,
  vignette = true,
  caption,
  captionDelay = 8,
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 90], [zoomFrom, zoomTo], {
    extrapolateRight: "clamp",
  });
  const capOpacity = caption
    ? interpolate(frame, [captionDelay, captionDelay + 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  const capY = interpolate(frame, [captionDelay, captionDelay + 12], [18, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={Math.round(startFrom * 30)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      {vignette ? (
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(7,9,8,0.35) 0%, transparent 22%, transparent 62%, rgba(7,9,8,0.78) 100%), linear-gradient(90deg, rgba(7,9,8,0.25) 0%, transparent 18%, transparent 82%, rgba(7,9,8,0.25) 100%)",
          }}
        />
      ) : null}
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 64,
            opacity: capOpacity,
            transform: `translateY(${capY}px)`,
            fontFamily: theme.font,
            color: theme.ink,
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "0.02em",
            textShadow: "0 10px 40px rgba(0,0,0,0.65)",
            maxWidth: 1100,
          }}
        >
          {caption}
          <div
            style={{
              marginTop: 10,
              width: 72,
              height: 4,
              borderRadius: 99,
              background: theme.gold,
            }}
          />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
