// src/components/PsycheLogo.tsx
import React from "react";

export interface PsycheLogoProps extends React.SVGProps<SVGSVGElement> {
  /** Total rendered size (width). Height is derived from viewBox unless you pass both. */
  size?: number | string;
  /** Letters to render inside the wings (pass "" to hide either). */
  letters?: [string, string];
  /** Letter size in the logo’s native units (default 1400). */
  letterSize?: number;
  /** Letter fill color */
  letterColor?: string;
  /** Head (circle) color */
  headColor?: string;
  /** Gradient colors (left-to-right) for both wings */
  wingStops?: [string, string, string];
  /** Accessible title / aria-label */
  title?: string;
}

const PsycheLogo: React.FC<PsycheLogoProps> = ({
  size = 128,
  letters = ["P", "S"],
  letterSize = 1400,
  letterColor = "#FFFFFF",
  headColor = "#0E8AA4",
  wingStops = ["#0E8AA4", "#199FAF", "#2EC2C8"],
  className,
  title = "Psyche Support",
  ...props
}) => {
  // viewBox is tight & centered to the artwork
  const viewBox = "0 0 1110 800";

  // If only `size` is provided, we set width; height will follow from viewBox aspect.
  const width = size;
  const height = typeof size === "number" ? undefined : undefined;

  // Letter coordinates in native (0.1-scaled) system with local vertical flip
  const leftX = 3000;
  const rightX = 8000;
  const flippedY = -4900;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <title>{title}</title>

      <defs>
        {/* Wing gradients */}
        <linearGradient id="wingLeft" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={wingStops[0]} />
          <stop offset="50%" stopColor={wingStops[1]} />
          <stop offset="100%" stopColor={wingStops[2]} />
        </linearGradient>
        <linearGradient id="wingRight" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor={wingStops[0]} />
          <stop offset="50%" stopColor={wingStops[1]} />
          <stop offset="100%" stopColor={wingStops[2]} />
        </linearGradient>
      </defs>

      {/* Render in original coordinate space (0.1 scale), then crop via viewBox */}
      <g transform="translate(0,800) scale(0.1,-0.1)" stroke="none">
        {/* LEFT WING (P removed in the base path) */}
        <path
          fill="url(#wingLeft)"
          d="M1920 7513 c-73 -7 -236 -46 -319 -75 -256 -90 -468 -249 -554 -414
l-37 -72 0 -139 c0 -221 33 -316 212 -606 102 -166 133 -232 201 -437 65 -192
102 -335 152 -585 78 -393 169 -675 305 -947 193 -386 391 -558 795 -694 308
-103 626 -116 1260 -53 113 11 212 18 218 16 7 -3 -4 -11 -23 -18 -77 -28
-271 -131 -367 -196 -179 -120 -294 -230 -511 -489 -129 -155 -204 -281 -237
-399 -22 -78 -32 -377 -16 -456 24 -116 61 -172 211 -320 76 -75 146 -151 157
-170 16 -31 18 -61 18 -314 0 -274 1 -281 23 -327 32 -64 91 -129 153 -169 68
-43 136 -51 343 -39 248 14 401 68 636 224 150 99 347 299 458 464 257 380
409 808 504 1417 22 142 23 176 22 610 0 330 -5 532 -18 715 -9 140 -19 256
-21 258 -1 2 -8 -20 -15 -49 -15 -60 -22 -53 -39 41 -39 208 -172 653 -276
915 -176 449 -474 910 -805 1249 -435 445 -845 726 -1310 899 -182 67 -451
132 -650 157 -78 9 -389 12 -470 3z m2347 -2275 c328 -259 838 -776 1066
-1079 95 -127 131 -257 131 -484 l1 -140 -91 -205 c-131 -292 -225 -516 -311
-735 -96 -247 -91 -235 -105 -235 -7 0 -32 9 -55 20 l-43 19 49 138 c47 134
163 424 242 606 21 50 39 94 39 99 0 14 -41 -17 -420 -321 -195 -157 -395
-316 -445 -354 l-90 -69 -32 38 c-18 20 -33 43 -33 50 0 7 156 138 348 290
421 337 502 404 615 514 130 125 131 128 135 346 l4 182 -59 44 c-161 124
-446 234 -761 293 -187 35 -186 35 -179 91 2 25 9 50 15 56 8 8 65 0 189 -25
263 -53 392 -95 661 -213 17 -8 32 -10 32 -6 0 5 -48 67 -107 138 -126 153
-506 535 -683 688 -231 200 -260 227 -260 244 0 16 47 72 61 72 4 0 43 -28 86
-62z"
        />

        {/* RIGHT WING (mirrored & centered with same spacing) */}
        <g transform="translate(11100,0) scale(-1,1)">
          <path
            fill="url(#wingRight)"
            d="M1920 7513 c-73 -7 -236 -46 -319 -75 -256 -90 -468 -249 -554 -414
l-37 -72 0 -139 c0 -221 33 -316 212 -606 102 -166 133 -232 201 -437 65 -192
102 -335 152 -585 78 -393 169 -675 305 -947 193 -386 391 -558 795 -694 308
-103 626 -116 1260 -53 113 11 212 18 218 16 7 -3 -4 -11 -23 -18 -77 -28
-271 -131 -367 -196 -179 -120 -294 -230 -511 -489 -129 -155 -204 -281 -237
-399 -22 -78 -32 -377 -16 -456 24 -116 61 -172 211 -320 76 -75 146 -151 157
-170 16 -31 18 -61 18 -314 0 -274 1 -281 23 -327 32 -64 91 -129 153 -169 68
-43 136 -51 343 -39 248 14 401 68 636 224 150 99 347 299 458 464 257 380
409 808 504 1417 22 142 23 176 22 610 0 330 -5 532 -18 715 -9 140 -19 256
-21 258 -1 2 -8 -20 -15 -49 -15 -60 -22 -53 -39 41 -39 208 -172 653 -276
915 -176 449 -474 910 -805 1249 -435 445 -845 726 -1310 899 -182 67 -451
132 -650 157 -78 9 -389 12 -470 3z m2347 -2275 c328 -259 838 -776 1066
-1079 95 -127 131 -257 131 -484 l1 -140 -91 -205 c-131 -292 -225 -516 -311
-735 -96 -247 -91 -235 -105 -235 -7 0 -32 9 -55 20 l-43 19 49 138 c47 134
163 424 242 606 21 50 39 94 39 99 0 14 -41 -17 -420 -321 -195 -157 -395
-316 -445 -354 l-90 -69 -32 38 c-18 20 -33 43 -33 50 0 7 156 138 348 290
421 337 502 404 615 514 130 125 131 128 135 346 l4 182 -59 44 c-161 124
-446 234 -761 293 -187 35 -186 35 -179 91 2 25 9 50 15 56 8 8 65 0 189 -25
263 -53 392 -95 661 -213 17 -8 32 -10 32 -6 0 5 -48 67 -107 138 -126 153
-506 535 -683 688 -231 200 -260 227 -260 244 0 16 47 72 61 72 4 0 43 -28 86
-62z"
          />
        </g>

        {/* Head (centered) */}
        <circle cx="5550" cy="5900" r="300" fill={headColor} />

        {/* Letters: upright via local flip, size customizable */}
        <g transform="scale(1,-1)">
          {!!letters[0] && (
            <text
              x={3000}
              y={-4900}
              fontSize={letterSize}
              fontWeight="bold"
              fontFamily="Inter, Arial, sans-serif"
              textAnchor="middle"
              fill={letterColor}
            >
              {letters[0]}
            </text>
          )}
          {!!letters[1] && (
            <text
              x={8000}
              y={-4900}
              fontSize={letterSize}
              fontWeight="bold"
              fontFamily="Inter, Arial, sans-serif"
              textAnchor="middle"
              fill={letterColor}
            >
              {letters[1]}
            </text>
          )}
        </g>
      </g>
    </svg>
  );
};

export default PsycheLogo;