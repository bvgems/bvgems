import { forwardRef } from "react";
import { MantineLoaderComponent } from "@mantine/core";

export const DiamondLoader: MantineLoaderComponent = forwardRef(
  ({ style, ...others }, ref) => (
    <svg
      {...others}
      ref={ref}
      style={{
        width: "var(--loader-size)",
        height: "var(--loader-size)",
        stroke: "var(--loader-color)",
        ...style,
      }}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#fff"
    >
      <g
        fill="none"
        fillRule="evenodd"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="30,5 55,30 30,55 5,30" strokeOpacity="0">
          <animate
            attributeName="stroke-opacity"
            begin="0s"
            dur="2s"
            values="0;1;0"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            begin="0s"
            dur="2s"
            values="1;3;1"
            repeatCount="indefinite"
          />
        </polygon>

        {/* Inner static diamond core */}
        <polygon points="30,15 45,30 30,45 15,30">
          <animate
            attributeName="stroke"
            values="#fff;#aaa;#fff"
            dur="2s"
            repeatCount="indefinite"
          />
        </polygon>

          <circle cx="30" cy="30" r="1">
          <animate
            attributeName="r"
            values="1;2;1"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            values="1;0.5;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  )
);
