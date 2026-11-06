/**
 * `react-qr-code` ships types at `types/index.d.ts` but does not expose them
 * through its package.json "exports" map, so TypeScript cannot resolve them
 * under `moduleResolution: bundler`. This declares the small surface we use.
 */
declare module "react-qr-code" {
  import type { CSSProperties, SVGProps } from "react";

  export interface QRCodeProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
    value: string;
    size?: number;
    level?: "L" | "M" | "Q" | "H";
    bgColor?: string;
    fgColor?: string;
    title?: string;
    style?: CSSProperties;
    className?: string;
  }

  const QRCode: (props: QRCodeProps) => JSX.Element;
  export default QRCode;
}
