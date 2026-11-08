import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fontSize?: number;
  color?: string;
  weight?: number;
  letterSpacing?: number;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
}> = ({
  children,
  delay = 0,
  fontSize = 64,
  color = theme.ink,
  weight = 700,
  letterSpacing = -0.02,
  align = "center",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const y = interpolate(t, [0, 1], [28, 0]);
  const opacity = interpolate(t, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontFamily: theme.font,
        fontSize,
        fontWeight: weight,
        color,
        letterSpacing: `${letterSpacing}em`,
        textAlign: align,
        opacity,
        transform: `translateY(${y}px)`,
        lineHeight: 1.05,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
