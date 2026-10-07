import { ImageResponse } from "next/og";

export const COMPILER_OG_SIZE = { width: 1200, height: 630 };

/** 1200×630 share card used by every compiler page and its how-it-works article. */
export function compilerOgImage({
  kicker,
  title,
  subtitle,
  code,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  code: string[];
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0f1612",
          color: "white",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 30, fontWeight: 800 }}>
            mentr
            <span style={{ marginLeft: 12, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>by Paprly</span>
          </div>
          <div style={{ marginTop: 56, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#5ee0a0" }}>{kicker}</div>
          <div style={{ marginTop: 16, fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
          <div style={{ marginTop: 24, fontSize: 27, lineHeight: 1.4, color: "rgba(255,255,255,0.68)" }}>{subtitle}</div>
          <div style={{ marginTop: "auto", fontSize: 22, color: "rgba(255,255,255,0.45)" }}>mentr.in</div>
        </div>
        <div
          style={{
            width: 400,
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
            border: "2px solid rgba(255,255,255,0.12)",
            background: "#0b100d",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 18px",
              borderBottom: "2px solid rgba(255,255,255,0.1)",
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            main.py
            <span style={{ background: "#2f9e6e", color: "white", padding: "6px 16px", fontSize: 18, fontWeight: 700 }}>▶ Run</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "18px 18px 22px", fontSize: 21, lineHeight: 1.6, fontFamily: "monospace" }}>
            {code.map((line, i) => (
              <div key={i} style={{ display: "flex", color: line.startsWith(">") ? "#5ee0a0" : "#e8ece9", whiteSpace: "pre" }}>
                {line || " "}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    COMPILER_OG_SIZE,
  );
}
