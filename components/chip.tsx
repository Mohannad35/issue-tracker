import { Chip, VariantProps } from '@nextui-org/react';
import { ReactNode } from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning' | undefined;
  label: string;
  variant: 'bordered' | 'dot' | 'faded' | 'flat' | 'light' | 'shadow' | 'solid' | undefined;
}

const CustomChip = ({ icon, color = 'primary', label, variant = 'flat', ...props }: ChipProps) => {
  return (
    <Chip startContent={icon} variant={variant} color={color} {...props}>
      {label}
    </Chip>
  );
};

export default CustomChip;
