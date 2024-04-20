import NextChip from '@/components/chip';
import { Priority } from '@prisma/client';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { ReactNode } from 'react';

const ChipPriority = ({ priority, color, label, icon, variant }: ChipPriorityProps) => {
  const priorityProps = getPriorityProps(priority);
  return (
    <NextChip
      color={color || priorityProps.color}
      label={label || priorityProps.label}
      variant={variant || 'faded'}
      icon={icon || priorityProps.icon}
    />
  );
};

export default ChipPriority;

interface ChipPriorityProps {
  priority?: Priority | undefined;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning' | undefined;
  label?: string | undefined;
  icon?: ReactNode;
  variant?: 'bordered' | 'dot' | 'faded' | 'flat' | 'light' | 'shadow' | 'solid' | undefined;
}

const getPriorityProps = (
  priority?: string | undefined
): {
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning' | undefined;
  label: string;
  icon: ReactNode;
} => {
  switch (priority) {
    case 'LOW':
      return { color: 'warning', label: 'Low', icon: <ArrowDownIcon /> };
    case 'MEDIUM':
      return { color: 'secondary', label: 'Medium', icon: <ArrowRightIcon /> };
    case 'HIGH':
      return { color: 'success', label: 'High', icon: <ArrowUpIcon /> };
    default:
      return { color: 'default', label: 'Unknown', icon: undefined };
  }
};
