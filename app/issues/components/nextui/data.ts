import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';

export const columns = [
  {
    name: 'TITLE',
    value: 'title',
    sortable: true,
    align: 'start',
  },
  {
    name: 'DESCRIPTION',
    value: 'description',
    sortable: true,
    align: 'start',
  },
  {
    name: 'STATUS',
    value: 'status',
    sortable: true,
    align: 'start',
  },
  {
    name: 'PRIORITY',
    value: 'priority',
    sortable: true,
    align: 'start',
  },
  {
    name: 'CREATED AT',
    value: 'createdAt',
    sortable: true,
    align: 'start',
  },
  {
    name: '',
    value: 'actions',
    align: 'end',
  },
];

export const statusOptions = [
  {
    label: 'Open',
    value: 'OPEN',
    icon: CircleIcon,
  },
  {
    label: 'In Progress',
    value: 'IN_PROGRESS',
    icon: StopwatchIcon,
  },
  {
    label: 'Done',
    value: 'DONE',
    icon: CheckCircledIcon,
  },
  {
    label: 'Canceled',
    value: 'CANCELLED',
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: 'Low',
    value: 'LOW',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'MEDIUM',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'HIGH',
    icon: ArrowUpIcon,
  },
];

// This type is used to define the shape of our data.
export type Issue = {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
};
