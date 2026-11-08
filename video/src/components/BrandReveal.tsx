import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CTA_URL } from "../constants";

export const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(t, [0, 1], [0, 1]);
  const y = interpolate(t, [0, 1], [24, 0]);
  const cta = spring({ frame: frame - 18, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <Img
        src={staticFile("brand/mentr-logo-light.png")}
        style={{ width: 220, height: "auto", filter: "brightness(0) invert(1)" }}
      />
      <div
        style={{
          fontFamily: theme.font,
          fontSize: 28,
          color: theme.goldSoft,
          letterSpacing: "0.18em",
          fontWeight: 600,
        }}
      >
        PYTHON — LEVEL 02 · INTERMEDIATE
      </div>
      <div
        style={{
          opacity: cta,
          transform: `translateY(${interpolate(cta, [0, 1], [16, 0])}px)`,
          marginTop: 18,
          padding: "16px 34px",
          borderRadius: 999,
          background: theme.coral,
          color: "#14110d",
          fontFamily: theme.font,
          fontWeight: 700,
          fontSize: 26,
        }}
      >
        START PYTHON LEVEL 2
      </div>
      <div
        style={{
          opacity: cta,
          fontFamily: theme.font,
          color: theme.muted,
          fontSize: 22,
          marginTop: 4,
        }}
      >
        {CTA_URL}
      </div>
    </div>
  );
};
