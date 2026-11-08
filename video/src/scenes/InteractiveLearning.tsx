import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ProductClip } from "../components/ProductClip";

/** 14–21s: practice + compiler run — the product demo */
export const InteractiveLearning: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={70}>
        <ProductClip
          src="clips/04-practice.mp4"
          startFrom={0.2}
          zoomFrom={1.03}
          zoomTo={1.09}
          caption="NOT JUST WATCHING."
          captionDelay={6}
        />
      </Sequence>
      <Sequence from={70} durationInFrames={140}>
        <ProductClip
          src="clips/05-compiler-run.mp4"
          startFrom={5.5}
          zoomFrom={1.0}
          zoomTo={1.06}
          caption="ACTUALLY CODING. INSTANT FEEDBACK."
          captionDelay={8}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
