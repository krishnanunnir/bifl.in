import { ImageResponse } from "next/og";

export const alt = "bifl.in — Buy It For Life India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#f8f6f0",
          backgroundImage: "radial-gradient(circle at 80% 20%, #ede3d2 0%, #f8f6f0 60%)",
          padding: "60px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "14px",
              backgroundColor: "#1c1917",
              border: "2px solid #8a6325",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e6ca65",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            B
          </div>
          <span style={{ fontSize: "36px", fontWeight: "bold", color: "#1c1917", letterSpacing: "-1px" }}>
            bifl<span style={{ color: "#8a6325" }}>.in</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontSize: "20px",
              fontFamily: "monospace",
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#8c3b2b",
              fontWeight: 700,
            }}
          >
            The Indian Heirloom Catalog
          </span>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#1c1917",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              maxWidth: "950px",
              margin: 0,
            }}
          >
            Buy It For Life India.
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#57534e",
              lineHeight: 1.4,
              maxWidth: "850px",
              margin: 0,
            }}
          >
            Generational, repairable, and heirloom goods built to outlast planned obsolescence.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "18px",
            fontFamily: "monospace",
            color: "#78716c",
            borderTop: "1px solid #e2dcd2",
            paddingTop: "24px",
            width: "100%",
          }}
        >
          <span>* Pure Cast Iron</span>
          <span>* Full-Grain Leather</span>
          <span>* Mechanical Horology</span>
          <span>* Tri-Ply Steel</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
