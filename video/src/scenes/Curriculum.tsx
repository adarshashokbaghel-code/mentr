import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ProductClip } from "../components/ProductClip";

/** 8–14s: lesson study + topic depth — real UI motion */
export const Curriculum: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={95}>
        <ProductClip
          src="clips/03-lesson-study.mp4"
          startFrom={0.2}
          zoomFrom={1.02}
          zoomTo={1.08}
          caption="GO BEYOND SYNTAX."
          captionDelay={8}
        />
      </Sequence>
      <Sequence from={95} durationInFrames={85}>
        <ProductClip
          src="clips/06-dicts-profile.mp4"
          startFrom={0.1}
          zoomFrom={1.04}
          zoomTo={1.1}
          caption="UNDERSTAND. EXPERIMENT. BUILD."
          captionDelay={6}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
