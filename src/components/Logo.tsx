// src/components/PsycheLogo.tsx
import React from "react";

export interface PsycheLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  letters?: [string, string];
}

const PsycheLogo: React.FC<PsycheLogoProps> = ({
  size = 128,
  letters = ["P", "S"],
  className,
  ...props
}) => (
  <svg
    viewBox="0 0 256 256"
    width={size}
    height={typeof size === "number" ? size : undefined}
    role="img"
    aria-label="Psyche Support butterfly logo"
    className={className}
    {...props}
  >
    {/* Body */}
    <rect x="124" y="90" width="8" height="70" rx="4" fill="#0E8AA4" />
    <circle cx="128" cy="80" r="6" fill="#0E8AA4" />

    {/* Antennae */}
    <path
      d="M124 74 C110 60, 96 58, 88 64 M132 74 C146 60, 160 58, 168 64"
      stroke="#0E8AA4"
      strokeWidth="3"
      fill="none"
    />

    {/* Upper left wing */}
    <path
      d="
        M128 92
        C 100 40, 40 70, 70 120
        C 85 145, 115 130, 122 115
        Z
      "
      fill="#0E8AA4"
    />

    {/* Upper right wing */}
    <path
      d="
        M128 92
        C 156 40, 216 70, 186 120
        C 171 145, 141 130, 134 115
        Z
      "
      fill="#2EC2C8"
    />

    {/* Lower left wing */}
    <path
      d="
        M124 120
        C 80 130, 60 170, 110 180
        C 120 176, 122 160, 122 145
        Z
      "
      fill="#199FAF"
    />

    {/* Lower right wing */}
    <path
      d="
        M132 120
        C 176 130, 196 170, 146 180
        C 136 176, 134 160, 134 145
        Z
      "
      fill="#199FAF"
    />

    {/* Letters in upper wings */}
    <text
      x="96"
      y="110"
      fontSize="26"
      fontWeight="bold"
      fontFamily="Inter, system-ui, sans-serif"
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#FFFFFF"
    >
      {letters[0]}
    </text>
    <text
      x="160"
      y="110"
      fontSize="26"
      fontWeight="bold"
      fontFamily="Inter, system-ui, sans-serif"
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#FFFFFF"
    >
      {letters[1]}
    </text>
  </svg>
);

export default PsycheLogo;
