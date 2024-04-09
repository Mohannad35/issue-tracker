import { Chip as NextChip, VariantProps } from '@nextui-org/react';
import { ReactNode } from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode | undefined;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning' | undefined;
  label: string;
  variant?: 'bordered' | 'dot' | 'faded' | 'flat' | 'light' | 'shadow' | 'solid' | undefined;
}

const Chip = ({ icon, color = 'primary', label, variant = 'flat', ...props }: ChipProps) => {
  return (
    <NextChip startContent={icon} variant={variant} color={color} {...props}>
      {label}
    </NextChip>
  );
};

export default Chip;
