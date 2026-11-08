import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";

const FULL = 'print("Hello, World!")';

export const CodeWindow: React.FC<{ startTypingAt?: number }> = ({
  startTypingAt = 8,
}) => {
  const frame = useCurrentFrame();
  const typed = Math.max(
    0,
    Math.min(FULL.length, Math.floor((frame - startTypingAt) / 1.55)),
  );
  const showCursor = frame % 18 < 11;
  const runAt = startTypingAt + FULL.length * 1.55 + 10;
  const executed = frame >= runAt;
  const outOpacity = interpolate(frame, [runAt, runAt + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const text = FULL.slice(0, typed);
  const fn = text.startsWith("print") ? "print" : text;
  const rest = text.startsWith("print") ? text.slice(5) : "";

  return (
    <div
      style={{
        width: 780,
        borderRadius: 18,
        overflow: "hidden",
        background: theme.codeBg,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
        fontFamily: theme.mono,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: 99, background: "#28c840" }} />
        <span style={{ marginLeft: 12, color: theme.muted, fontSize: 13 }}>main.py</span>
      </div>
      <div style={{ padding: "32px 36px", fontSize: 30, minHeight: 130, lineHeight: 1.4 }}>
        {text.startsWith("print") || text.length === 0 ? (
          <>
            <span style={{ color: theme.codePink }}>{fn === "print" ? "print" : ""}</span>
            <span style={{ color: theme.codeOrange }}>{rest}</span>
          </>
        ) : (
          <span style={{ color: theme.ink }}>{text}</span>
        )}
        {showCursor ? (
          <span
            style={{
              display: "inline-block",
              width: 13,
              height: 30,
              marginLeft: 2,
              background: theme.goldSoft,
              verticalAlign: "text-bottom",
            }}
          />
        ) : null}
      </div>
      {executed ? (
        <div
          style={{
            opacity: outOpacity,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 36px 22px",
            color: theme.codeGreen,
            fontSize: 24,
          }}
        >
          → Hello, World!
        </div>
      ) : null}
    </div>
  );
};
