import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const ProductMockup: React.FC<{
  src: string;
  delay?: number;
  scaleFrom?: number;
  scaleTo?: number;
  panY?: number;
  radius?: number;
}> = ({
  src,
  delay = 0,
  scaleFrom = 1.08,
  scaleTo = 1.0,
  panY = 0,
  radius = 22,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [40, 0]);
  const scale = interpolate(frame, [delay, delay + 90], [scaleFrom, scaleTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [delay, delay + 120], [0, panY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          width: 1480,
          height: 860,
          borderRadius: radius,
          overflow: "hidden",
          boxShadow: "0 50px 140px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
          transform: `scale(${scale}) translateY(${drift}px)`,
          background: "#111",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top center",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
