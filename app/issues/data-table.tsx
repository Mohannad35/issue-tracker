'use client';

import { Icons } from '@/components/icons';
import { seedIssues } from '@/lib/seedIssues';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
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
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import { capitalize } from 'lodash';
import { DatabaseBackupIcon, PlusCircleIcon, RefreshCw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, Key, useCallback, useEffect, useMemo, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { columns, getIssues, Issue, priorities, statusOptions } from './utils';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import CustomChip from '@/components/chip';

const INITIAL_VISIBLE_COLUMNS = [
  'title',
  'description',
  'status',
  'priority',
  'createdAt',
  'actions',
];

export default function IssuesTable() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
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
  // const pages = Math.ceil(issues.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    getIssues().then(issues => {
      setIssues(issues);
      setLoading(false);
    });
  }, []);

  const refreshData = useCallback(async () => {
    const issues = await getIssues();
    setIssues(issues);
  }, [setIssues]);

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
    return issues
      .filter(issue => {
        if (hasSearchFilter && !issue.title.toLowerCase().includes(filterValue.toLowerCase()))
          return false;
        if (statusFilter !== 'all' && !Array.from(statusFilter).includes(issue.status))
          return false;
        return true;
      })
      .sort((a: Issue, b: Issue) => {
        const first = a[sortDescriptor.column as keyof Issue] as string | Date;
        const second = b[sortDescriptor.column as keyof Issue] as string | Date;
        const cmp = first < second ? -1 : first > second ? 1 : 0;
        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      });
  }, [
    issues,
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

  const onAction = useCallback((key: Key, issue: Issue) => {
    switch (key) {
      case 'edit':
        break;
      case 'delete':
        break;
      default:
        break;
    }
  }, []);

  const renderCell = useCallback(
    (issue: Issue, columnKey: Key): string | JSX.Element => {
      const cellValue = issue[columnKey as keyof Issue];
      switch (columnKey) {
        case 'title':
          return (
            <div className='flex'>
              <span className='max-w-[300px] truncate font-medium'>{String(cellValue)}</span>
            </div>
          );
        case 'description':
          return (
            <div className='flex flex-col'>
              <span className='max-w-[400px] truncate'>{String(cellValue)}</span>
            </div>
          );
        case 'status':
          const status = statusOptions.find(status => status.value === cellValue);
          if (!status) return '';
          return (
            <CustomChip
              color={['secondary', 'primary'].includes(status.color) ? undefined : status.color}
              label={status.label}
              variant='flat'
              icon={status.icon && <status.icon />}
              className={cn({
                'text-violet-500 bg-violet-500/20': status.color === 'secondary',
                'text-blue-500 bg-blue-500/20': status.color === 'primary',
              })}
            />
          );
        case 'priority':
          const priority = priorities.find(priority => priority.value === cellValue);
          if (!priority) return '';
          return (
            <CustomChip
              color={['secondary', 'primary'].includes(priority.color) ? undefined : priority.color}
              label={priority.label}
              variant='faded'
              icon={priority.icon && <priority.icon />}
              className={cn({
                'text-violet-500': priority.color === 'secondary',
                'text-blue-500': priority.color === 'primary',
              })}
            />
          );
        case 'createdAt':
          return (
            <div className='flex items-center'>
              <span>{new Date(cellValue).toDateString()}</span>
            </div>
          );
        case 'actions':
          return (
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
          );
        default:
          return String(cellValue);
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
            placeholder='Search by name...'
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
              {issues.length !== items.length
                ? 'Found ' + items.length + ' of ' + issues.length + ' issues'
                : 'Total ' + issues.length + ' issues'}
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
    issues.length,
    items.length,
    rowsPerPage,
    onRowsPerPageChange,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className='flex justify-between items-center min-h-[51px]'>
        {loading || isLoadingRefresh ? (
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
  }, [loading, isLoadingRefresh, page, pages, selectedKeys, items.length]);

  return (
    <Table
      isStriped
      isHeaderSticky
      // isCompact
      // removeWrapper
      // classNames={classNames}
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
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={pageItems}
        isLoading={loading || isLoadingRefresh}
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
              {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
}
