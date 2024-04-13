'use client';

import Chip from '@/components/chip';
import { cn } from '@/lib/utils';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  useDisclosure,
} from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Key, useCallback, useRef, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Id, toast } from 'react-toastify';
import { priorities, statusOptions } from './_components/utils';

const RenderCellHook = () => {
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | undefined>(undefined);

  let { theme, systemTheme } = useTheme();
  const toastId = useRef<Id | null>(null);
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const handleDelete = async () => {
    if (!issue) return;
    toastId.current = toast('Deleting issue...', {
      autoClose: false,
      type: 'default',
      isLoading: true,
      theme: theme === 'system' ? systemTheme : (theme as 'dark' | 'light' | undefined),
    });
    const response = await fetch(`/api/issues/${issue.slug}`, {
      method: 'DELETE',
      cache: 'no-store',
    });
    if (response.ok) {
      const { title }: Issue = await response.json();
      onCloseDelete();
      toastId.current &&
        toast.update(toastId.current, {
          isLoading: false,
          type: 'success',
          render: `${title} deleted`,
          autoClose: 3000,
          progress: 0,
        });
      // Redirect to the issues page.
      // setTimeout(async () => await refreshData(), 3000);
      setTimeout(() => window.location.reload(), 3000);
    } else if (response.status >= 400 && response.status < 500) {
      const { message } = await response.json();
      onCloseDelete();
      toastId.current &&
        toast.update(toastId.current, {
          isLoading: false,
          type: 'error',
          render: message || 'An unexpected error occurred. Please try again later.',
          autoClose: 3000,
          progress: 0,
        });
      setTimeout(() => window.location.reload(), 3000);
    } else if (response.status >= 500) {
      onCloseDelete();
      toastId.current &&
        toast.update(toastId.current, {
          type: 'error',
          render: 'An unexpected error occurred. Please try again later.',
          autoClose: 3000,
        });
      setTimeout(() => window.location.reload(), 3000);
    }
  };

  const onAction = useCallback(
    (key: Key, issue: Issue) => {
      switch (key) {
        case 'edit':
          router.push(`/issues/${issue.slug}/edit`);
          break;
        case 'delete':
          setIssue(issue);
          onOpenDelete();
          break;
        default:
          break;
      }
    },
    [onOpenDelete, router, setIssue]
  );

  const renderCell = useCallback(
    (issue: Issue, columnKey: Key): { content: JSX.Element; textValue: string } => {
      const cellValue = issue[columnKey as keyof Issue];
      switch (columnKey) {
        case 'title':
          return {
            content: (
              <div className='flex'>
                <Link href={`/issues/${issue.slug}`} color='primary' underline='hover'>
                  <span className='max-w-[300px] truncate font-medium'>{String(cellValue)}</span>
                </Link>
              </div>
            ),
            textValue: String(cellValue),
          };
        case 'description':
          return {
            content: (
              <div className='flex'>
                <span className='max-w-[400px] truncate'>{String(cellValue)}</span>
              </div>
            ),
            textValue: String(cellValue),
          };
        case 'status':
          const status = statusOptions.find(status => status.value === cellValue);
          if (!status)
            return {
              content: <Chip color='default' label='Unknown' variant='flat' />,
              textValue: String(cellValue),
            };
          return {
            content: (
              <Chip
                color={['secondary', 'primary'].includes(status.color) ? undefined : status.color}
                label={status.label}
                variant='flat'
                icon={status.icon && <status.icon />}
                className={cn({
                  'text-violet-500 bg-violet-500/20': status.color === 'secondary',
                  'text-blue-500 bg-blue-500/20': status.color === 'primary',
                })}
              />
            ),
            textValue: String(cellValue),
          };
        case 'priority':
          const priority = priorities.find(priority => priority.value === cellValue);
          if (!priority)
            return {
              content: <Chip color='default' label='Unknown' variant='flat' />,
              textValue: String(cellValue),
            };
          return {
            content: (
              <Chip
                color={
                  ['secondary', 'primary'].includes(priority.color) ? undefined : priority.color
                }
                label={priority.label}
                variant='faded'
                icon={priority.icon && <priority.icon />}
                className={cn({
                  'text-violet-500': priority.color === 'secondary',
                  'text-blue-500': priority.color === 'primary',
                })}
              />
            ),
            textValue: String(cellValue),
          };
        case 'createdAt':
          return {
            content: (
              <div className='flex items-center'>
                <span>{new Date(cellValue).toDateString()}</span>
              </div>
            ),
            textValue: String(cellValue),
          };
        case 'actions':
          return {
            content: (
              <div className='relative flex justify-end items-center gap-2'>
                <Dropdown className='bg-background border-1 border-default-200'>
                  <DropdownTrigger>
                    <Button isIconOnly radius='full' size='sm' variant='light'>
                      <HiDotsHorizontal size={20} className='text-muted-foreground' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu onAction={key => onAction(key, issue)}>
                    <DropdownItem key={'view'} href={`/issues/${issue.slug}`}>
                      View
                    </DropdownItem>
                    <DropdownItem key={'edit'}>Edit</DropdownItem>
                    <DropdownItem key={'delete'} color='danger' className='text-danger'>
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            ),
            textValue: String(cellValue),
          };
        default:
          return { content: <div>{String(cellValue)}</div>, textValue: String(cellValue) };
      }
    },
    [onAction]
  );

  return { issue, isOpenDelete, renderCell, handleDelete, onOpenChangeDelete, onCloseDelete };
};

export default RenderCellHook;
