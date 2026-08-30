import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  const imageData = readFileSync(join(process.cwd(), "public", "logo-bronco-gold.png"));
  const base64Image = `data:image/png;base64,${imageData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a120b",
          border: "20px solid #000000",
          boxSizing: "border-box",
        }}
      >
        <img
          src={base64Image}
          alt=""
          width={340}
          height={420}
          style={{ objectFit: "contain" }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 60,
            maxWidth: 620,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              color: "#ffc72c",
              lineHeight: 1.25,
            }}
          >
            Natrona County Vote Wranglers
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 28,
              color: "#c9a227",
              letterSpacing: 2,
            }}
          >
            NON-PARTISAN ELECTION INFO AND SIGNS
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
