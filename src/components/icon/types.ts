import { ICON_NAMES } from './names';

export type IconProps = {
  name: IconNames;
  className?: string;
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
};

export type IconNames = (typeof ICON_NAMES)[number];
