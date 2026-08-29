import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 22,
              height: 14,
              backgroundColor: "#ffc72c",
              border: "2px solid #000000",
            }}
          />
          <div
            style={{
              display: "flex",
              width: 3,
              height: 8,
              backgroundColor: "#000000",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
