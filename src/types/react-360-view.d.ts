// src/types/react-360-view.d.ts
declare module "react-360-view" {
  import * as React from "react";

  interface ThreeSixtyProps {
    amount: number;
    imagePath: string;
    fileName: string;
    autoplay?: boolean;
    speed?: number;
    loop?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }

  const ThreeSixty: React.FC<ThreeSixtyProps>;

  export default ThreeSixty;
}
