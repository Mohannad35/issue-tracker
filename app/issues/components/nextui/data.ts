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
  { name: 'TITLE', uid: 'title', sortable: true },
  { name: 'DESCRIPTION', uid: 'description', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'PRIORITY', uid: 'priority', sortable: true },
  { name: 'CREATED AT', uid: 'createdAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
];

export const statusOptions = [
  { name: 'Open', uid: 'OPEN', icon: CircleIcon },
  { name: 'In Progress', uid: 'IN_PROGRESS', icon: StopwatchIcon },
  { name: 'Done', uid: 'DONE', icon: CheckCircledIcon },
  { name: 'Canceled', uid: 'CANCELLED', icon: CrossCircledIcon },
];

export const priorities = [
  { label: 'Low', value: 'LOW', icon: ArrowDownIcon },
  { label: 'Medium', value: 'MEDIUM', icon: ArrowRightIcon },
  { label: 'High', value: 'HIGH', icon: ArrowUpIcon },
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
