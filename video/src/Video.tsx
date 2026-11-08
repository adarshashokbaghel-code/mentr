import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Shot } from "./components/Shot";
import { BrandReveal } from "./components/BrandReveal";
import { CodeWindow } from "./components/CodeWindow";
import { theme, DURATION } from "./theme";

const Cut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/**
 * YC-style 45s launch:
 * problem hook → product → fast multi-angle workflow → proof → CTA
 */
export const MentrPythonL2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {/* 0–4s HOOK */}
      <Sequence from={0} durationInFrames={60}>
        <Cut>
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at 50% 40%, rgba(224,168,58,0.14), ${theme.bg} 55%)`,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CodeWindow startTypingAt={3} />
          </AbsoluteFill>
        </Cut>
      </Sequence>
      <Sequence from={60} durationInFrames={60}>
        <Cut>
          <Shot
            src="clips/yc-marketing.mp4"
            startFrom={1}
            crop={{ x: "50%", y: "35%", scale: 1.05 }}
            caption="YOU KNOW PRINT. JOBS DON'T CARE."
          />
        </Cut>
      </Sequence>

      {/* 4–9s PRODUCT IN */}
      <Sequence from={120} durationInFrames={75}>
        <Cut>
          <Shot
            src="clips/yc-int-home.mp4"
            startFrom={0.4}
            crop={{ x: "55%", y: "20%", scale: 1.0 }}
            caption="MENTR PYTHON — LEVEL 02"
          />
        </Cut>
      </Sequence>
      <Sequence from={195} durationInFrames={75}>
        <Cut>
          <Shot
            src="clips/yc-int-home.mp4"
            startFrom={3.5}
            crop={{ x: "30%", y: "55%", scale: 1.35 }}
            caption="INTERMEDIATE. LIVE NOW."
            zoomFrom={1}
            zoomTo={1.06}
          />
        </Cut>
      </Sequence>

      {/* 9–22s WORKFLOW MONTAGE — multi angle */}
      <Sequence from={270} durationInFrames={50}>
        <Cut>
          <Shot
            src="clips/yc-study.mp4"
            startFrom={0.5}
            crop={{ x: "60%", y: "30%", scale: 1.15 }}
            caption="STUDY THE IDEA."
          />
        </Cut>
      </Sequence>
      <Sequence from={320} durationInFrames={45}>
        <Cut>
          <Shot
            src="clips/yc-study.mp4"
            startFrom={4}
            crop={{ x: "15%", y: "40%", scale: 1.45 }}
            caption="TWELVE LESSONS. REAL SPECS."
          />
        </Cut>
      </Sequence>
      <Sequence from={365} durationInFrames={50}>
        <Cut>
          <Shot
            src="clips/yc-practice.mp4"
            startFrom={0.8}
            crop={{ x: "55%", y: "35%", scale: 1.2 }}
            caption="PRACTICE UNTIL IT STICKS."
          />
        </Cut>
      </Sequence>
      <Sequence from={415} durationInFrames={55}>
        <Cut>
          <Shot
            src="clips/yc-practice.mp4"
            startFrom={4}
            crop={{ x: "70%", y: "50%", scale: 1.5 }}
            caption="DICTS. JSON. OOP. SHIPPING."
          />
        </Cut>
      </Sequence>
      <Sequence from={470} durationInFrames={70}>
        <Cut>
          <Shot
            src="clips/yc-compiler.mp4"
            startFrom={4.5}
            crop={{ x: "35%", y: "40%", scale: 1.25 }}
            caption="WRITE THE FUNCTION."
          />
        </Cut>
      </Sequence>
      <Sequence from={540} durationInFrames={80}>
        <Cut>
          <Shot
            src="clips/yc-compiler.mp4"
            startFrom={8}
            crop={{ x: "75%", y: "45%", scale: 1.55 }}
            caption="HIT RUN. SEE OUTPUT."
          />
        </Cut>
      </Sequence>
      <Sequence from={620} durationInFrames={70}>
        <Cut>
          <Shot
            src="clips/yc-compiler.mp4"
            startFrom={11}
            crop={{ x: "50%", y: "30%", scale: 1.08 }}
            caption="INSTANT FEEDBACK. IN THE BROWSER."
          />
        </Cut>
      </Sequence>

      {/* 23–31s PROOF */}
      <Sequence from={690} durationInFrames={90}>
        <Cut>
          <Shot
            src="clips/yc-int-home.mp4"
            startFrom={2}
            crop={{ x: "50%", y: "25%", scale: 1.1 }}
            caption="SKILLS YOU CAN SHOW."
          />
        </Cut>
      </Sequence>
      <Sequence from={780} durationInFrames={90}>
        <Cut>
          <Shot
            src="clips/yc-study.mp4"
            startFrom={7}
            crop={{ x: "55%", y: "25%", scale: 1.18 }}
            caption="FROM SYNTAX → TO BUILDING."
          />
        </Cut>
      </Sequence>

      {/* 29–36s more product energy */}
      <Sequence from={870} durationInFrames={90}>
        <Cut>
          <Shot
            src="clips/yc-marketing.mp4"
            startFrom={4}
            crop={{ x: "50%", y: "45%", scale: 1.2 }}
            caption="FREE. NO CARD."
          />
        </Cut>
      </Sequence>

      {/* 36–45s CTA */}
      <Sequence from={960} durationInFrames={120}>
        <Cut>
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at 50% 40%, rgba(224,168,58,0.16), ${theme.bg} 55%)`,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BrandReveal />
          </AbsoluteFill>
        </Cut>
      </Sequence>
      <Sequence from={1080} durationInFrames={90}>
        <Cut>
          <Shot
            src="clips/yc-compiler.mp4"
            startFrom={12}
            crop={{ x: "70%", y: "50%", scale: 1.4 }}
            caption="START LEVEL 2 → mentr.in/learnpython"
          />
        </Cut>
      </Sequence>
      <Sequence from={1170} durationInFrames={180}>
        <Cut>
          <AbsoluteFill
            style={{
              background: theme.bg,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BrandReveal />
          </AbsoluteFill>
        </Cut>
      </Sequence>

      <Audio src={staticFile("audio/vo-yc.mp3")} volume={1} />
      <Audio src={staticFile("audio/bed-yc.m4a")} volume={0.14} />
      <Sequence from={55} durationInFrames={15}>
        <Audio src={staticFile("audio/impact.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={470} durationInFrames={12}>
        <Audio src={staticFile("audio/click.wav")} volume={0.22} />
      </Sequence>
      <Sequence from={540} durationInFrames={15}>
        <Audio src={staticFile("audio/impact.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={1170} durationInFrames={20}>
        <Audio src={staticFile("audio/impact.wav")} volume={0.35} />
      </Sequence>

      <Sequence from={DURATION - 1} durationInFrames={1}>
        <AbsoluteFill />
      </Sequence>
    </AbsoluteFill>
  );
};
