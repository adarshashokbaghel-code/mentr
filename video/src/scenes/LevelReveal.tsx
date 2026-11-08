import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ProductClip } from "../components/ProductClip";
import { theme } from "../theme";

/** 4–8s: real Intermediate LMS — live navigation */
export const LevelReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const badge = interpolate(frame, [6, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <ProductClip
        src="clips/02-int-home.mp4"
        startFrom={0.3}
        zoomFrom={1.0}
        zoomTo={1.06}
        caption="PYTHON LEVEL 02 — INTERMEDIATE"
        captionDelay={10}
      />
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 72,
          opacity: badge,
          padding: "10px 16px",
          borderRadius: 999,
          background: "rgba(224,168,58,0.92)",
          color: "#1a1408",
          fontFamily: theme.font,
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: "0.14em",
        }}
      >
        INTRODUCING
      </div>
    </AbsoluteFill>
  );
};
