const CX = 240;
const CY = 240;

// Top and bottom arcs use different radii on purpose: at an equal radius,
// this browser renders text on a clockwise vs counter-clockwise arc at a
// visibly different distance from the path, so the bottom radius is
// pushed out slightly to compensate and keep both lines an equal visual
// distance from the art.
const TOP_R = 150;
const BOTTOM_R = 170;

const TOP_ARC = `M ${CX - TOP_R},${CY} A ${TOP_R},${TOP_R} 0 0 1 ${CX + TOP_R},${CY}`;
const BOTTOM_ARC = `M ${CX - BOTTOM_R},${CY} A ${BOTTOM_R},${BOTTOM_R} 0 0 0 ${CX + BOTTOM_R},${CY}`;

export default function Logo() {
  return (
    <svg
      viewBox="0 0 480 480"
      width={420}
      height={420}
      role="img"
      aria-label="Natrona County Vote Wranglers"
    >
      <defs>
        <path id="logo-top-arc" d={TOP_ARC} fill="none" />
        <path id="logo-bottom-arc" d={BOTTOM_ARC} fill="none" />
      </defs>

      <image
        href="/logo-bronco-gold.png"
        x={CX - 85}
        y={CY - 105}
        width={170}
        height={210}
        preserveAspectRatio="xMidYMid meet"
      />

      <text fontSize="24" fill="#ffc72c" letterSpacing="6">
        <textPath href="#logo-top-arc" startOffset="50%" textAnchor="middle">
          NATRONA COUNTY
        </textPath>
      </text>

      <text fontSize="24" fill="#ffc72c" letterSpacing="6">
        <textPath href="#logo-bottom-arc" startOffset="50%" textAnchor="middle">
          VOTE WRANGLERS
        </textPath>
      </text>
    </svg>
  );
}
