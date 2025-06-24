export const BraceletSVG = () => {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="150"
        cy="150"
        r="100"
        stroke="#D4AF37"
        strokeWidth="15"
        fill="none"
      />

      <circle cx="150" cy="50" r="10" fill="#1E90FF" />
      <circle cx="195" cy="65" r="10" fill="#1E90FF" />
      <circle cx="230" cy="100" r="10" fill="#1E90FF" />
      <circle cx="245" cy="145" r="10" fill="#1E90FF" />
      <circle cx="230" cy="190" r="10" fill="#1E90FF" />
      <circle cx="195" cy="225" r="10" fill="#1E90FF" />
      <circle cx="150" cy="240" r="10" fill="#1E90FF" />
      <circle cx="105" cy="225" r="10" fill="#1E90FF" />
      <circle cx="70" cy="190" r="10" fill="#1E90FF" />
      <circle cx="55" cy="145" r="10" fill="#1E90FF" />
      <circle cx="70" cy="100" r="10" fill="#1E90FF" />
      <circle cx="105" cy="65" r="10" fill="#1E90FF" />
    </svg>
  );
};


export const Solitaire = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="6" stroke={fill} strokeWidth="2" />
    <line x1="12" y1="24" x2="18" y2="24" stroke={fill} strokeWidth="2" />
    <line x1="30" y1="24" x2="36" y2="24" stroke={fill} strokeWidth="2" />
  </svg>
);

export const ThreeStone = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="5" stroke={fill} strokeWidth="2" />
    <circle cx="16" cy="24" r="3" stroke={fill} strokeWidth="1.5" />
    <circle cx="32" cy="24" r="3" stroke={fill} strokeWidth="1.5" />
  </svg>
);

export const SideStone = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="20" y="18" width="8" height="12" stroke={fill} strokeWidth="2" />
    <circle cx="14" cy="24" r="3" stroke={fill} strokeWidth="2" />
    <circle cx="34" cy="24" r="3" stroke={fill} strokeWidth="2" />
  </svg>
);

export const Halo = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="8" stroke={fill} strokeWidth="2" />
    <circle
      cx="24"
      cy="24"
      r="12"
      stroke={fill}
      strokeWidth="1"
      strokeDasharray="2 2"
    />
  </svg>
);

export const Engagement = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="7" stroke={fill} strokeWidth="2" />
    <path
      d="M24 10 L26 16 H22 L24 10Z"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const Antique = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="6" stroke={fill} strokeWidth="2" />
    <circle
      cx="24"
      cy="24"
      r="10"
      stroke={fill}
      strokeWidth="1"
      strokeDasharray="3 1"
    />
  </svg>
);

export const WeddingSets = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="24" r="6" stroke={fill} strokeWidth="2" />
    <circle cx="28" cy="24" r="6" stroke={fill} strokeWidth="2" />
  </svg>
);

export const TwoStone = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="18" cy="24" r="5" stroke={fill} strokeWidth="2" />
    <circle cx="30" cy="24" r="5" stroke={fill} strokeWidth="2" />
    <line x1="18" y1="24" x2="30" y2="24" stroke={fill} strokeWidth="2" />
  </svg>
);

export const MensRing = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="12"
      y="16"
      width="24"
      height="16"
      rx="4"
      stroke={fill}
      strokeWidth="2"
    />
    <circle cx="24" cy="24" r="4" stroke={fill} strokeWidth="2" />
  </svg>
);

export const Celtic = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 10 C12 20, 12 28, 24 38 C36 28, 36 20, 24 10 Z"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const Astrological = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="10" stroke={fill} strokeWidth="2" />
    <path d="M18 18 L30 30 M30 18 L18 30" stroke={fill} strokeWidth="2" />
  </svg>
);

export const ShapeRound = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="24" cy="24" r="10" stroke={fill} strokeWidth="2" fill="none" />
    <line x1="24" y1="14" x2="24" y2="34" stroke={fill} strokeWidth="1.5" />
    <line x1="14" y1="24" x2="34" y2="24" stroke={fill} strokeWidth="1.5" />
  </svg>
);

export const ShapeOval = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="24"
      cy="24"
      rx="8"
      ry="12"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
    <line x1="24" y1="12" x2="24" y2="36" stroke={fill} strokeWidth="1.5" />
  </svg>
);

export const ShapeCushion = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="14"
      y="14"
      width="20"
      height="20"
      rx="5"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
    <line x1="14" y1="24" x2="34" y2="24" stroke={fill} strokeWidth="1.5" />
    <line x1="24" y1="14" x2="24" y2="34" stroke={fill} strokeWidth="1.5" />
  </svg>
);

export const ShapeRadiant = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="16,12 32,12 36,24 32,36 16,36 12,24"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const ShapeEmerald = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="16"
      y="12"
      width="16"
      height="24"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
    <line x1="16" y1="24" x2="32" y2="24" stroke={fill} strokeWidth="1.5" />
  </svg>
);

export const ShapeAsscher = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="18,12 30,12 36,18 36,30 30,36 18,36 12,30 12,18"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
    <rect
      x="20"
      y="20"
      width="8"
      height="8"
      stroke={fill}
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

export const ShapePear = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 12 C18 20, 18 36, 24 36 C30 36, 30 20, 24 12 Z"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const ShapeBaguette = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="16"
      y="16"
      width="16"
      height="16"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
    <line x1="16" y1="16" x2="32" y2="32" stroke={fill} strokeWidth="1" />
    <line x1="32" y1="16" x2="16" y2="32" stroke={fill} strokeWidth="1" />
  </svg>
);

export const ShapeHeart = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 34 C20 30, 12 24, 16 18 C18 14, 24 16, 24 20 C24 16, 30 14, 32 18 C36 24, 28 30, 24 34 Z"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const ShapeMarquise = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx="24"
      cy="24"
      rx="12"
      ry="6"
      transform="rotate(45 24 24)"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const ShapeTrillion = ({ fill = "black" }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polygon
      points="24,12 36,36 12,36"
      stroke={fill}
      strokeWidth="2"
      fill="none"
    />
    <line x1="24" y1="12" x2="24" y2="36" stroke={fill} strokeWidth="1" />
  </svg>
);
