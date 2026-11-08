import React from "react";
import { AbsoluteFill } from "remotion";
import { BrandReveal } from "../components/BrandReveal";
import { theme } from "../theme";

export const FinalCTA: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 40%, rgba(224,168,58,0.14), ${theme.bg} 55%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BrandReveal />
    </AbsoluteFill>
  );
};
