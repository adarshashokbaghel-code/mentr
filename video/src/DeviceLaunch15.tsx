import React from "react";
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Sora";

const { fontFamily } = loadFont();

const BG = "#050506";
const SPACE = "#6e6e73";
const SPACE_L = "#8e8e93";
const SPACE_D = "#3a3a3c";
const SPACE_X = "#1c1c1e";
const WHITE = "#f5f5f7";
const MUTED = "#98989d";
const INK = "#1d1d1f";

export const DEVICE_LAUNCH_DURATION = 450;

const Screen: React.FC<{
  src: string;
  startFrom?: number;
  playbackRate?: number;
}> = ({ src, startFrom = 0, playbackRate = 1.25 }) => (
  <OffthreadVideo
    src={staticFile(src)}
    startFrom={Math.round(startFrom * 30)}
    playbackRate={playbackRate}
    muted
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "top center",
    }}
  />
);

const MacBookShell: React.FC<{
  children: React.ReactNode;
  scale: number;
  opacity: number;
  y: number;
  rotate: number;
}> = ({ children, scale, opacity, y, rotate }) => {
  const lidW = 1120;
  const lidH = 700;
  const bezel = 12;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "48%",
        opacity,
        transform: `translate(-50%, calc(-50% + ${y}px)) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "50% 50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 50px 80px rgba(0,0,0,0.7))",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: lidW,
          height: lidH,
          borderRadius: "16px 16px 6px 6px",
          background: `linear-gradient(165deg, ${SPACE_L} 0%, ${SPACE} 40%, ${SPACE_D} 100%)`,
          padding: bezel,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 5,
            background: "#000",
            padding: "7px 7px 9px",
            position: "relative",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 7,
              height: 7,
              borderRadius: 99,
              background: "radial-gradient(circle at 35% 35%, #555 0%, #111 70%)",
              zIndex: 2,
            }}
          />
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 2,
              overflow: "hidden",
              background: "#000",
              position: "relative",
            }}
          >
            {children}
          </div>
        </div>
      </div>

      <div
        style={{
          width: lidW + 28,
          height: 10,
          marginTop: -1,
          borderRadius: 2,
          background: `linear-gradient(180deg, ${SPACE_D}, ${SPACE}, ${SPACE_D})`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      />

      <div
        style={{
          width: lidW + 48,
          height: 22,
          borderRadius: "0 0 12px 12px",
          background: `linear-gradient(180deg, ${SPACE} 0%, ${SPACE_D} 60%, ${SPACE_X} 100%)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 100,
            height: 4,
            borderRadius: 2,
            background: "rgba(0,0,0,0.35)",
          }}
        />
      </div>
    </div>
  );
};

const IPhoneShell: React.FC<{
  children: React.ReactNode;
  scale: number;
  opacity: number;
  y: number;
  rotate: number;
}> = ({ children, scale, opacity, y, rotate }) => {
  const w = 340;
  const h = 700;
  const pad = 11;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "48%",
        width: w,
        height: h,
        opacity,
        transform: `translate(-50%, calc(-50% + ${y}px)) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: "50% 50%",
        borderRadius: 50,
        background: `linear-gradient(145deg, #2c2c2e 0%, #111113 42%, #000000 100%)`,
        padding: pad,
        boxShadow:
          "0 50px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(255,255,255,0.06)",
        filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.55))",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -2.5,
          top: 130,
          width: 3,
          height: 28,
          borderRadius: 1,
          background: SPACE_D,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -2.5,
          top: 170,
          width: 3,
          height: 50,
          borderRadius: 1,
          background: SPACE_D,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -2.5,
          top: 230,
          width: 3,
          height: 50,
          borderRadius: 1,
          background: SPACE_D,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -2.5,
          top: 200,
          width: 3,
          height: 75,
          borderRadius: 1,
          background: SPACE_D,
        }}
      />

      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 40,
          overflow: "hidden",
          background: "#000",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            width: 110,
            height: 30,
            borderRadius: 99,
            background: "#000",
            zIndex: 4,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
          }}
        />
        {children}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 4,
            borderRadius: 99,
            background: "rgba(255,255,255,0.5)",
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
};

const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  const opacity = interpolate(t, [0, 1], [0, 1]);
  const y = interpolate(t, [0, 1], [28, 0]);
  const scale = interpolate(t, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(ellipse at 50% 45%, #16181e 0%, ${BG} 70%)`,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          fontFamily,
        }}
      >
        <div
          style={{
            color: MUTED,
            fontSize: 12,
            letterSpacing: "0.42em",
            fontWeight: 600,
          }}
        >
          LAUNCHING
        </div>
        <div
          style={{
            color: WHITE,
            fontSize: 62,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.02,
          }}
        >
          Python Intermediate
        </div>
        <div
          style={{
            marginTop: 14,
            padding: "15px 46px",
            borderRadius: 999,
            background: WHITE,
            color: INK,
            fontWeight: 650,
            fontSize: 16,
          }}
        >
          Start →
        </div>
        <div style={{ color: MUTED, fontSize: 14, fontWeight: 500 }}>
          mentr.in/learnpython
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DeviceLaunch15: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast-paced launch beats (15s @ 30fps)
  // 0–0.4s snap in → LP scroll → LMS → morph → phone scroll → CTA
  const morph = spring({
    frame: frame - 105,
    fps,
    config: { damping: 22, stiffness: 95, mass: 0.7 },
    durationInFrames: 55,
  });
  const morphClamped = Math.min(1, Math.max(0, morph));

  const deskSwap = interpolate(frame, [48, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const mobSwap = interpolate(frame, [175, 188], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const laptopScale = interpolate(morphClamped, [0, 1], [1, 0.18]);
  const laptopOpacity = interpolate(morphClamped, [0, 0.45, 0.72], [1, 0.4, 0], {
    extrapolateRight: "clamp",
  });

  const phoneScale = interpolate(morphClamped, [0.08, 1], [0.28, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneOpacity = interpolate(morphClamped, [0.05, 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Constant micro-motion — launch energy
  const floatY = Math.sin(frame / 18) * 6;
  const floatRot = Math.sin(frame / 28) * 0.6;
  const phoneFloatY = Math.sin((frame + 40) / 16) * 8;
  const phoneFloatRot = Math.sin((frame + 20) / 24) * 0.8;

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130 },
  });
  const stageScale = interpolate(enter, [0, 1], [0.88, 1]);
  const stageOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Slow push-in while laptop is up
  const camPush = interpolate(frame, [8, 100], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showDevices = frame < 385;
  const ctaStart = 365;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 52%, rgba(150,155,170,0.14) 0%, transparent 70%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 40% 28% at 50% 35%, rgba(255,255,255,0.04) 0%, transparent 65%)",
        }}
      />

      {showDevices ? (
        <AbsoluteFill
          style={{
            opacity: stageOpacity,
            transform: `scale(${stageScale * (morphClamped < 0.5 ? camPush : 1)})`,
          }}
        >
          <AbsoluteFill>
            <MacBookShell
              scale={laptopScale}
              opacity={laptopOpacity}
              y={floatY}
              rotate={floatRot}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 1 - deskSwap,
                  }}
                >
                  <Screen
                    src="clips/device-desk-lp.mp4"
                    startFrom={0.35}
                    playbackRate={1.35}
                  />
                </div>
                <div
                  style={{ position: "absolute", inset: 0, opacity: deskSwap }}
                >
                  <Screen
                    src="clips/device-desk-lms.mp4"
                    startFrom={0.2}
                    playbackRate={1.3}
                  />
                </div>
              </div>
            </MacBookShell>

            <IPhoneShell
              scale={phoneScale}
              opacity={phoneOpacity}
              y={phoneFloatY}
              rotate={phoneFloatRot}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 1 - mobSwap,
                  }}
                >
                  <Screen
                    src="clips/device-mob-lp.mp4"
                    startFrom={0.25}
                    playbackRate={1.4}
                  />
                </div>
                <div
                  style={{ position: "absolute", inset: 0, opacity: mobSwap }}
                >
                  <Screen
                    src="clips/device-mob-lms.mp4"
                    startFrom={0.15}
                    playbackRate={1.35}
                  />
                </div>
              </div>
            </IPhoneShell>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Sequence from={ctaStart} durationInFrames={85}>
        <CTA />
      </Sequence>

      {frame < 340 ? (
        <div
          style={{
            position: "absolute",
            top: 42,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily,
            color: MUTED,
            fontSize: 13,
            letterSpacing: "0.38em",
            fontWeight: 600,
            opacity: interpolate(frame, [4, 12, 310, 335], [0, 1, 1, 0]),
          }}
        >
          MENTR · PYTHON INTERMEDIATE
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
