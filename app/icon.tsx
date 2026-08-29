import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  const imageData = readFileSync(join(process.cwd(), "public", "logo-cowboy-gold.png"));
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
          backgroundColor: "#3d2817",
        }}
      >
        <img
          src={base64Image}
          alt=""
          width={26}
          height={26}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
