import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.has("title")
      ? searchParams.get("title")?.slice(0, 100)
      : "SmartNivad Deals";

    const price = searchParams.get("price");
    const store = searchParams.get("store") || "SmartNivad";

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a", // slate-900
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundColor: "rgba(30, 41, 59, 0.9)", // slate-800
            padding: "40px 80px",
            borderRadius: "24px",
            border: "2px solid #3b82f6", // blue-500
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            maxWidth: "80%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <span
              style={{ fontSize: "32px", color: "#60a5fa", fontWeight: "bold" }}
            >
              {store}
            </span>
            <span
              style={{ fontSize: "32px", color: "#94a3b8", margin: "0 16px" }}
            >
              •
            </span>
            <span
              style={{ fontSize: "32px", color: "#10b981", fontWeight: "bold" }}
            >
              Best Price Detected
            </span>
          </div>

          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#f8fafc",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            {title}
          </h1>

          {price && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#10b981", // emerald-500
                padding: "12px 32px",
                borderRadius: "16px",
                marginTop: "10px",
              }}
            >
              <span
                style={{ fontSize: "48px", fontWeight: 900, color: "white" }}
              >
                ₹{price}
              </span>
            </div>
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.error("OG Image Generation Error:", e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
