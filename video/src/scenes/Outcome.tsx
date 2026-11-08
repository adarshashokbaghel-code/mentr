import React from "react";
import { AbsoluteFill } from "remotion";
import { ProductClip } from "../components/ProductClip";

/** 21–26s: keep showing real product — compiler climax / profile */
export const Outcome: React.FC = () => {
  return (
    <AbsoluteFill>
      <ProductClip
        src="clips/05-compiler-run.mp4"
        startFrom={11}
        zoomFrom={1.04}
        zoomTo={1.1}
        caption="FROM LEARNING TO BUILDING."
        captionDelay={6}
      />
    </AbsoluteFill>
  );
};
