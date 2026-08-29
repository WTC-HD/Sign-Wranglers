import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/app/config/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a120b",
          border: "20px solid #000000",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 110,
            height: 70,
            backgroundColor: "#ffc72c",
            border: "6px solid #000000",
          }}
        />
        <div
          style={{
            display: "flex",
            width: 14,
            height: 40,
            backgroundColor: "#000000",
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 68,
            fontWeight: 700,
            color: "#ffc72c",
            textAlign: "center",
            padding: "0 100px",
            lineHeight: 1.3,
          }}
        >
          {SITE_CONFIG.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 30,
            color: "#c9a227",
            textAlign: "center",
          }}
        >
          {SITE_CONFIG.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
