import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "SmartNivad - Find the Best Deals";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 64,
        background: "#050816",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "24px",
          padding: "40px 80px",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: 80,
            color: "#00E5FF",
            marginRight: "20px",
          }}
        >
          Smart
        </span>
        <span style={{ fontWeight: 800, fontSize: 80, color: "white" }}>
          Nivad
        </span>
      </div>
      <div
        style={{
          marginTop: "40px",
          fontSize: 40,
          fontWeight: 500,
          color: "#A1A1AA", // zinc-400 equivalent
        }}
      >
        Find the Best Tech Deals. Save More.
      </div>
    </div>,
    {
      ...size,
    },
  );
}
