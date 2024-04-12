'use client';

import Chip from '@/components/chip';
import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { seedIssues } from '@/lib/seedIssues';
import { cn } from '@/lib/utils';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  Selection,
  SelectItem,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import { capitalize, sortBy, filter } from 'lodash';
import { DatabaseBackupIcon, PlusCircleIcon, RefreshCw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { columns, priorities, statusOptions } from './_components/utils';
import { Issue } from '@prisma/client';
import { Id, toast } from 'react-toastify';
import { useTheme } from 'next-themes';

const INITIAL_VISIBLE_COLUMNS = [
  'title',
  'description',
  'status',
  'priority',
  'createdAt',
  'actions',
];

async function getIssues() {
  const issues: Issue[] = await (await fetch('/api/issues', { method: 'GET' })).json();
  return issues;
}

export default function IssuesTable({ issues }: { issues: Issue[] }) {
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | undefined>(undefined);
  const [issuesN, setIssuesN] = useState<Issue[]>(issues);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [numberOfSeed, setNumberOfSeed] = useState(10);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingSeed, setIsLoadingSeed] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'createdAt',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const hasSearchFilter = Boolean(filterValue);
  let { theme, systemTheme } = useTheme();
  const toastId = useRef<Id | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onOpenChange: onOpenChangeDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  const refreshData = useCallback(async () => {
    const issues = await getIssues();
    setIssuesN(issues);
  }, [setIssuesN]);

  const onClickRefresh = useCallback(async () => {
    setIsLoadingRefresh(true);
    await refreshData();
    setIsLoadingRefresh(false);
  }, [refreshData]);

  const onCloseSeed = useCallback(() => {
    onClose();
    setNumberOfSeed(10);
  }, [onClose, setNumberOfSeed]);

  const onPressSeed = useCallback(async () => {
    if (typeof numberOfSeed !== 'number' || isNaN(numberOfSeed) || numberOfSeed < 1) return;
    onClose();
    setIsLoadingSeed(true);
    await seedIssues(window.location.origin + '/api/issues', numberOfSeed);
    setIsLoadingSeed(false);
    setNumberOfSeed(10);
  }, [numberOfSeed, onClose, setIsLoadingSeed, setNumberOfSeed]);

  const onPressNew = useCallback(() => {
    setIsLoadingNew(true);
    router.push('/issues/new');
  }, [setIsLoadingNew, router]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(column => Array.from(visibleColumns).includes(column.value));
  }, [visibleColumns]);

  const items = useMemo(() => {
    return issuesN
      .filter(issue => {
        if (hasSearchFilter && !issue.title.toLowerCase().includes(filterValue.toLowerCase()))
          return false;
        if (statusFilter !== 'all' && !Array.from(statusFilter).includes(issue.status))
          return false;
        return true;
      })
      .sort((a: Issue, b: Issue) => {
        if (typeof a[sortDescriptor.column as keyof Issue] === 'string') {
          const first = (a[sortDescriptor.column as keyof Issue] as string).toLowerCase();
          const second = (b[sortDescriptor.column as keyof Issue] as string).toLowerCase();
          const cmp = first < second ? -1 : first > second ? 1 : 0;
          return sortDescriptor.direction === 'ascending' ? -cmp : cmp;
        }
        const first = a[sortDescriptor.column as keyof Issue] as Date;
        const second = b[sortDescriptor.column as keyof Issue] as Date;
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === 'ascending' ? -cmp : cmp;
      });
  }, [
    issuesN,
    hasSearchFilter,
    filterValue,
    statusFilter,
    sortDescriptor.column,
    sortDescriptor.direction,
  ]);

  const pages = useMemo(() => Math.ceil(items.length / rowsPerPage), [items.length, rowsPerPage]);
  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, rowsPerPage, items]);

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
    [onOpenDelete, router]
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

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else setFilterValue('');
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1',
            }}
            placeholder='Search by title...'
            size='md'
            startContent={<Search className='text-default-300' />}
            value={filterValue}
            variant='bordered'
            onClear={() => setFilterValue('')}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <Button
              isIconOnly
              isLoading={isLoadingRefresh}
              spinner={<RefreshCw size={20} className='animate-spin' />}
              onClick={onClickRefresh}
              variant='bordered'
              size='md'
            >
              <RefreshCw size={20} />
              <span className='sr-only'>Refresh table data</span>
            </Button>

            <Button
              color='default'
              variant='bordered'
              startContent={<PlusCircleIcon size={20} />}
              isLoading={isLoadingNew}
              onPress={onPressNew}
              className='max-w-40'
              size='md'
            >
              New Issue
            </Button>

            <Button
              color='default'
              variant='bordered'
              startContent={<DatabaseBackupIcon size={20} />}
              isLoading={isLoadingSeed}
              onPress={onOpen}
              size='md'
            >
              Seed Issues
            </Button>

            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              classNames={{ base: 'border border-danger' }}
            >
              <ModalContent>
                <ModalHeader className='flex flex-col gap-1'>
                  Are you sure you want to seed issues?
                </ModalHeader>
                <ModalBody>
                  <p>This action is irreversible and will delete all data in issue database.</p>
                  <Input
                    // className='border border-destructive'
                    type='number'
                    value={numberOfSeed.toString()}
                    label='Number of issues to seed'
                    placeholder='Enter seed number'
                    onValueChange={(value: string) => setNumberOfSeed(parseInt(value))}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color='default' variant='light' onPress={onCloseSeed}>
                    Close
                  </Button>
                  <Button color='danger' onPress={onPressSeed}>
                    Seed
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={<Icons.ChevronDownIcon className='text-small' />}
                  size='md'
                  variant='bordered'
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode='multiple'
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map(status => (
                  <DropdownItem key={status.value} className='capitalize'>
                    {capitalize(status.label)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={<Icons.ChevronDownIcon className='text-small' />}
                  size='md'
                  variant='bordered'
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={setVisibleColumns}
              >
                {columns.map(column => (
                  <DropdownItem key={column.value} className='capitalize'>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div>
            <span className='text-muted-foreground text-small'>
              {issuesN.length !== items.length
                ? 'Found ' + items.length + ' of ' + issuesN.length + ' issues'
                : 'Total ' + issuesN.length + ' issues'}
            </span>
          </div>

          <Select
            label='Rows per page'
            labelPlacement='outside-left'
            classNames={{
              base: 'max-w-[163px] items-center',
              label: 'text-default-400',
              mainWrapper: 'max-w-[70px]',
              trigger: 'max-w-[70px]',
            }}
            value={rowsPerPage.toString()}
            defaultSelectedKeys={rowsPerPage.toString()}
            disallowEmptySelection
            onChange={onRowsPerPageChange}
            variant='bordered'
            size='sm'
          >
            {[5, 10, 15, 20, 25, 30].map(rows => (
              <SelectItem key={rows.toString()} value={rows.toString()}>
                {rows.toString()}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    isLoadingRefresh,
    onClickRefresh,
    isLoadingNew,
    onPressNew,
    isLoadingSeed,
    onOpen,
    isOpen,
    onOpenChange,
    numberOfSeed,
    onCloseSeed,
    onPressSeed,
    statusFilter,
    visibleColumns,
    issuesN.length,
    items.length,
    rowsPerPage,
    onRowsPerPageChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className='flex justify-between items-center min-h-[51px]'>
        {isLoadingRefresh ? (
          <Skeleton className='mt-1 ml-4 h-4 w-1/4 rounded-lg' />
        ) : (
          <Pagination
            showControls
            color='primary'
            variant='light'
            page={page}
            total={pages}
            onChange={setPage}
          />
        )}

        <span className='text-small text-default-400'>
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [isLoadingRefresh, page, pages, selectedKeys, items.length]);

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

  return (
    <>
      <Table
        isStriped
        isHeaderSticky
        selectedKeys={selectedKeys}
        selectionMode='multiple'
        sortDescriptor={sortDescriptor}
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
        topContent={topContent}
        topContentPlacement='outside'
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        aria-label='Issues table showing all issues with sorting and filtering options'
        showSelectionCheckboxes
        checkboxesProps={{ color: 'primary' }}
        classNames={{ wrapper: 'max-h-[640px]' }}
      >
        <TableHeader columns={headerColumns}>
          {column => (
            <TableColumn
              key={column.value}
              align={column.align as 'center' | 'end' | 'start'}
              allowsSorting={column.sortable}
              textValue={column.value}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={pageItems}
          isLoading={isLoadingRefresh}
          loadingContent={
            <div className='flex flex-col w-full h-full'>
              <div className='flex w-full h-unit-18' />
              <div className='flex flex-col w-full h-full justify-around bg-neutral-900 z-10 px-5'>
                {[...new Array(rowsPerPage)].map((_, index) => (
                  <Skeleton key={index} className='h-3 w-full rounded-lg' />
                ))}
              </div>
            </div>
          }
          emptyContent={
            <div className='flex flex-col w-full h-[238px] justify-center'>{'No issues found'}</div>
          }
        >
          {item => {
            return (
              <TableRow key={item.id}>
                {columnKey => {
                  const { content, textValue } = renderCell(item, columnKey);
                  return <TableCell textValue={textValue}>{content}</TableCell>;
                }}
              </TableRow>
            );
          }}
        </TableBody>
      </Table>

      <Modal isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete}>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Delete {issue?.title}?</ModalHeader>
          <ModalBody>
            <p>This Action can&apos;t be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button color='default' variant='light' onPress={onCloseDelete}>
              Close
            </Button>
            <Button color='danger' onPress={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
