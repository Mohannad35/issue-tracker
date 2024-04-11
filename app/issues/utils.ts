import { Issue } from '@prisma/client';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import { BsFillCircleFill, BsStopwatchFill, BsXCircleFill } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { z } from 'zod';

// This function is used to fetch data from the server.
export async function getIssues() {
  // const headersList = headers();
  // const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const issues: Issue[] = await (await fetch('/api/issues', { method: 'GET' })).json();
  return issues;
}

// You can use a Zod schema here if you want.
export const issueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  slug: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

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

export interface StatusOption {
  label: 'Open' | 'In Progress' | 'Done' | 'Canceled';
  value: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  icon: typeof BsFillCircleFill;
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning';
}

export const statusOptions: StatusOption[] = [
  {
    label: 'Open',
    value: 'OPEN',
    icon: BsFillCircleFill,
    color: 'primary',
  },
  {
    label: 'In Progress',
    value: 'IN_PROGRESS',
    icon: BsStopwatchFill,
    color: 'warning',
  },
  {
    label: 'Done',
    value: 'DONE',
    icon: FaCheckCircle,
    color: 'success',
  },
  {
    label: 'Canceled',
    value: 'CANCELLED',
    icon: BsXCircleFill,
    color: 'danger',
  },
];

export interface PriorityOption {
  label: 'Low' | 'Medium' | 'High';
  value: 'LOW' | 'MEDIUM' | 'HIGH';
  icon: typeof ArrowDownIcon;
  color: 'primary' | 'secondary' | 'success' | 'danger' | 'default' | 'warning';
}

export const priorities: PriorityOption[] = [
  {
    label: 'Low',
    value: 'LOW',
    icon: ArrowDownIcon,
    color: 'secondary',
  },
  {
    label: 'Medium',
    value: 'MEDIUM',
    icon: ArrowRightIcon,
    color: 'primary',
  },
  {
    label: 'High',
    value: 'HIGH',
    icon: ArrowUpIcon,
    color: 'success',
  },
];
