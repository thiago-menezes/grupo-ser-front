import type { IconProps } from './types';

export const Icon = ({
  name,
  className = '',
  filled = false,
  size,
  style,
}: IconProps) => {
  const baseClass = filled ? `ti ti-${name}-filled` : `ti ti-${name}`;

  return (
    <i
      className={`${baseClass} ${className}`}
      style={
        {
          fontSize: typeof size === 'number' ? size : '',
          ...style,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
};

export type { IconProps, IconNames } from './types';
