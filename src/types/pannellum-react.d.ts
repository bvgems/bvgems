declare module "pannellum-react" {
  import * as React from "react";

  interface PannellumProps {
    width: string | number;
    height: string | number;
    image: string;
    pitch?: number;
    yaw?: number;
    hfov?: number;
    autoLoad?: boolean;
    showControls?: boolean;
    onLoad?: () => void;
    onScenechange?: () => void;
    onError?: (error: string) => void;
  }

  export const Pannellum: React.FC<PannellumProps>;
}
