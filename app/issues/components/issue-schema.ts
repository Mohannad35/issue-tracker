import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';
import { z } from 'zod';

// This type is used to define the shape of our data.
export type Issue = {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
};

// You can use a Zod schema here if you want.
export const issueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const statuses = [
  { value: 'OPEN', label: 'Open', icon: CircleIcon },
  { value: 'IN_PROGRESS', label: 'In Progress', icon: StopwatchIcon },
  { value: 'DONE', label: 'Done', icon: CheckCircledIcon },
  { value: 'CANCELLED', label: 'Canceled', icon: CrossCircledIcon },
];

export const priorities = [
  { label: 'Low', value: 'LOW', icon: ArrowDownIcon },
  { label: 'Medium', value: 'MEDIUM', icon: ArrowRightIcon },
  { label: 'High', value: 'HIGH', icon: ArrowUpIcon },
];
