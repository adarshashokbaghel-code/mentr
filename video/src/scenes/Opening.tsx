import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { CodeWindow } from "../components/CodeWindow";
import { ProductClip } from "../components/ProductClip";
import { theme } from "../theme";

/** 0–4s: quick code hook morphs into live product scroll */
export const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const codeOut = interpolate(frame, [55, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const productIn = interpolate(frame, [55, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <AbsoluteFill style={{ opacity: productIn }}>
        <ProductClip
          src="clips/01-hero-scroll.mp4"
          startFrom={0.4}
          zoomFrom={1.04}
          zoomTo={1.1}
          caption="YOU KNOW THE BASICS. WHAT'S NEXT?"
          captionDelay={20}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: codeOut,
          justifyContent: "center",
          alignItems: "center",
          background: `radial-gradient(ellipse at 50% 40%, rgba(224,168,58,0.16), ${theme.bg} 55%)`,
        }}
      >
        <CodeWindow startTypingAt={4} />
      </AbsoluteFill>
      {/* keep product sequence continuous under the fade */}
      <Sequence from={0} durationInFrames={1}>
        <AbsoluteFill />
      </Sequence>
    </AbsoluteFill>
  );
};
