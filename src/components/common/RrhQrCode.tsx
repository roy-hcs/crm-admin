import { QRCodeSVG } from 'qrcode.react';
export const RrhQrCode = ({
  value,
  ...props
}: {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
  includeMargin?: boolean;
  title?: string;
  minVersion?: number;
  boostLevel?: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
    x?: number;
    y?: number;
    crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
    opacity?: number;
  };
}) => {
  return <QRCodeSVG value={value} {...props} />;
};
