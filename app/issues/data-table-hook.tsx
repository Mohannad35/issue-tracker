'use client';

import Chip from '@/components/chip';
import { Skeleton } from '@/components/ui/skeleton';
import { seedIssues } from '@/lib/seedIssues';
import { cn } from '@/lib/utils';
import { issuesQuerySchema } from '@/lib/validationSchemas';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Link } from '@nextui-org/link';
import { Selection, SortDescriptor } from '@nextui-org/table';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { Issue } from '@prisma/client';
import { Flex, Text } from '@radix-ui/themes';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { difference } from 'lodash';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, Key, useEffect, useRef, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { Id, toast } from 'react-toastify';
import { columns, priorities, statusOptions } from './_components/utils';
import ChipPriority from '../_components/chip-priority';
import ChipStatus from '../_components/chip-status';

const INITIAL_VISIBLE_COLUMNS = [
  'title',
  'description',
  'status',
  'priority',
  'createdAt',
  'actions',
];

const DataTableHook = (
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Issue[], Error>>
) => {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const { theme, systemTheme } = useTheme();
  const [issue, setIssue] = useState<Issue | undefined>(undefined);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingSeed, setIsLoadingSeed] = useState(false);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [numberOfSeed, setNumberOfSeed] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState(() => {
    if (!searchParams.has('search')) return '';
    const valid = issuesQuerySchema.safeParse({ search: searchParams.get('search') });
    if (!valid.success) return '';
    return valid.data.search;
  });
  const [statusFilter, setStatusFilter] = useState<Selection>(() => {
    if (!searchParams.has('status')) return 'all';
    const valid = issuesQuerySchema.safeParse({ status: searchParams.get('status')?.split(',') });
    if (!valid.success) return 'all';
    return new Set(valid.data.status);
  });
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(() => {
    if (!searchParams.has('sortBy')) return { column: 'createdAt', direction: 'descending' };
    const valid = issuesQuerySchema.safeParse({
      sortBy: searchParams.get('sortBy'),
      direction: searchParams.get('direction'),
    });
    if (!valid.success) return { column: 'createdAt', direction: 'ascending' };
    const { direction, sortBy } = valid.data;
    return {
      column: sortBy,
      direction: ['asc', 'ascending'].includes(direction!) ? 'ascending' : 'descending',
    };
  });
  const [actions, setActions] = useState(() => {
    if (status === 'authenticated') {
      return [
        { key: 'view', label: 'View' },
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete' },
      ];
    }
    return [{ key: 'view', label: 'View' }];
  });
  const toastId = useRef<Id | null>(null);
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenSeed,
    onOpen: onOpenSeed,
    onOpenChange: onOpenChangeSeed,
    onClose: onCloseSeed,
  } = useDisclosure();

  useEffect(() => {
    if (statusFilter === 'all') return;
    const filter = Array.from(statusFilter);
    // If the filter includes all, remove the status query parameter.
    const diff = difference(
      statusOptions.map(option => option.value),
      filter
    );
    const params = new URLSearchParams(searchParams.toString());
    if (diff.length === 0) {
      const query = deleteQueryString(['status'], params);
      return router.push('/issues' + (query && query.length > 0) ? '?' + query : '');
    }
    const query = createQueryString([{ name: 'status', value: filter.join(',') }], params);
    router.push('/issues?' + query);
  }, [router, statusFilter]);

  useEffect(() => {
    onClickRefresh();
  }, [searchParams]);

  useEffect(() => {
    if (status === 'authenticated')
      setActions([
        { key: 'view', label: 'View' },
        { key: 'edit', label: 'Edit' },
        { key: 'delete', label: 'Delete' },
      ]);
    else setActions([{ key: 'view', label: 'View' }]);
  }, [status]);

  const onAction = (key: Key, issue: Issue) => {
    switch (key) {
      case 'view':
        router.push(`/issues/${issue.slug}`);
        break;
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
  };

  const renderCell = (
    issue: Issue,
    columnKey: Key
  ): { content: JSX.Element; textValue: string } => {
    const { title, description, status, priority, createdAt } = issue;
    const cellValue = issue[columnKey as keyof Issue];
    switch (columnKey) {
      case 'title':
        return {
          content: (
            <Flex>
              <Link href={`/issues/${issue.slug}`} color='primary' underline='hover'>
                <Text truncate weight='medium' wrap='nowrap' className='max-w-[300px]'>
                  {title}
                </Text>
              </Link>
            </Flex>
          ),
          textValue: String(title),
        };
      case 'description':
        return {
          content: (
            <Flex>
              <Text truncate wrap='nowrap' className='max-w-[400px]'>
                {description}
              </Text>
            </Flex>
          ),
          textValue: String(description),
        };
      case 'status':
        return {
          content: <ChipStatus status={status} />,
          textValue: String(status),
        };
      case 'priority':
        return {
          content: <ChipPriority priority={priority} />,
          textValue: String(priority),
        };
      case 'createdAt':
        return {
          content: (
            <div className='flex items-center'>
              <span>{new Date(createdAt).toDateString()}</span>
            </div>
          ),
          textValue: new Date(createdAt).toDateString(),
        };
      case 'actions':
        return {
          content: (
            <div className=''>
              <Dropdown className=''>
                <DropdownTrigger>
                  <Button isIconOnly radius='full' size='sm' variant='light'>
                    <HiDotsHorizontal size={20} className='text-muted-foreground' />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu items={actions} onAction={key => onAction(key, issue)}>
                  {({ key, label }) => (
                    <DropdownItem
                      key={key}
                      color={key === 'delete' ? 'danger' : 'default'}
                      className={key === 'delete' ? 'text-danger' : ''}
                    >
                      {label}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          ),
          textValue: 'actions',
        };
      default:
        return { content: <div>{String(cellValue)}</div>, textValue: String(cellValue) };
    }
  };

  const onRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === '') {
      setFilterValue('');
      setPage(1);
      const query = deleteQueryString(['search'], params);
      return router.push('/issues' + (query && query.length > 0) ? '?' + query : '');
    } else if (value) {
      setFilterValue(value);
      setPage(1);
      const query = createQueryString([{ name: 'search', value }], params);
      return router.push('/issues?' + query);
    }
  };

  const onClickRefresh = async () => {
    setIsLoadingRefresh(true);
    await refetch();
    setIsLoadingRefresh(false);
  };

  const handleCloseSeed = () => {
    onCloseSeed();
    setNumberOfSeed(10);
  };

  const onPressSeed = async () => {
    if (typeof numberOfSeed !== 'number' || isNaN(numberOfSeed) || numberOfSeed < 1) return;
    onCloseSeed();
    setIsLoadingSeed(true);
    await seedIssues(window.location.origin + '/api/issues', numberOfSeed);
    setIsLoadingSeed(false);
    setNumberOfSeed(10);
  };

  const onPressNew = () => {
    setIsLoadingNew(true);
    router.push('/issues/new');
  };

  const headerColumns =
    visibleColumns === 'all'
      ? columns
      : columns.filter(column => Array.from(visibleColumns).includes(column.value));

  const loadingContent = (
    <Flex direction={'column'} width={'100%'} height={'100%'}>
      <Flex
        direction={'column'}
        width={'100%'}
        justify={'between'}
        mt={'65px'}
        px={'20px'}
        pt={'10px'}
        pb={'20px'}
        gap={'28px'}
        className='bg-neutral-900 z-10'
      >
        {[...new Array(rowsPerPage)].map((_, index) => (
          <Skeleton key={index} className='h-[20px] w-full rounded-lg' />
        ))}
      </Flex>
    </Flex>
  );

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

  const handleSortChange = (descriptor: SortDescriptor) => {
    const { column, direction } = descriptor;
    const valid = issuesQuerySchema.safeParse({ column, direction });
    if (!valid.success) return;
    if (column && direction) {
      const params = new URLSearchParams(searchParams.toString());
      const query = createQueryString(
        [
          { name: 'sortBy', value: column.toString() },
          { name: 'direction', value: direction },
        ],
        params
      );
      setSortDescriptor(descriptor);
      router.push('/issues?' + query);
    }
  };

  return {
    page,
    issue,
    status,
    filterValue,
    statusFilter,
    sortDescriptor,
    rowsPerPage,
    numberOfSeed,
    selectedKeys,
    visibleColumns,
    headerColumns,
    loadingContent,
    isOpenSeed,
    isLoadingRefresh,
    isLoadingSeed,
    isLoadingNew,
    isOpenDelete,
    onOpenChangeSeed,
    setNumberOfSeed,
    handleCloseSeed,
    onPressSeed,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    onPressNew,
    onOpenChangeDelete,
    onCloseDelete,
    handleDelete,
    setSelectedKeys,
    onOpenSeed,
    setPage,
    onRowsPerPageChange,
    setVisibleColumns,
    renderCell,
    setStatusFilter,
    handleSortChange,
  };
};

export default DataTableHook;

const deleteQueryString = (entries: string[], params: URLSearchParams) => {
  entries.forEach(name => params.delete(name));
  return params.toString();
};

const createQueryString = (entries: { name: string; value: string }[], params: URLSearchParams) => {
  entries.forEach(({ name, value }) => params.set(name, value));
  return params.toString();
};
