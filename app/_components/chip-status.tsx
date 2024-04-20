import NextChip from '@/components/chip';
import { Status } from '@prisma/client';
import { ReactNode } from 'react';
import { BsFillCircleFill, BsStopwatchFill, BsXCircleFill } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';

const ChipStatus = ({ status, color, label, icon, variant }: ChipProps) => {
  const statusProps = getStatusProps(status);
  return (
    <NextChip
      color={color || statusProps.color}
      label={label || statusProps.label}
      variant={variant || 'flat'}
      icon={icon || statusProps.icon}
    />
  );
};

export default ChipStatus;

interface ChipProps {
  status?: Status | undefined;
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning' | undefined;
  label?: string | undefined;
  icon?: ReactNode;
  variant?: 'bordered' | 'dot' | 'faded' | 'flat' | 'light' | 'shadow' | 'solid' | undefined;
}

const getStatusProps = (
  status?: string | undefined
): {
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning' | undefined;
  label: string;
  icon: ReactNode;
} => {
  switch (status) {
    case 'OPEN':
      return { color: 'secondary', label: 'Open', icon: <BsFillCircleFill /> };
    case 'CANCELLED':
      return { color: 'danger', label: 'Cancelled', icon: <BsXCircleFill /> };
    case 'IN_PROGRESS':
      return { color: 'warning', label: 'In Progress', icon: <BsStopwatchFill /> };
    case 'CLOSED':
      return { color: 'success', label: 'Closed', icon: <FaCheckCircle /> };
    default:
      return { color: 'default', label: 'Unknown', icon: undefined };
  }
};
