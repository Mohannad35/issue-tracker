'use client';

import { Icons } from '@/components/icons';
import { seedIssues } from '@/lib/seedIssues';
import {
  Button,
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
  Select,
  Selection,
  SelectItem,
  SortDescriptor,
  useDisclosure,
} from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { capitalize } from 'lodash';
import { DatabaseBackupIcon, PlusCircleIcon, RefreshCw, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { columns, statusOptions } from './_components/utils';

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

const TopContentHook = (issues: Issue[]) => {
  const router = useRouter();
  const [issuesN, setIssuesN] = useState<Issue[]>(issues);
  const [filterValue, setFilterValue] = useState('');
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingSeed, setIsLoadingSeed] = useState(false);
  const [numberOfSeed, setNumberOfSeed] = useState(10);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    isOpen: isOpenSeed,
    onOpen: onOpenSeed,
    onOpenChange: onOpenChangeSeed,
    onClose: onCloseSeed,
  } = useDisclosure();
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'createdAt',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

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

  const refreshData = useCallback(async () => {
    const issues = await getIssues();
    setIssuesN(issues);
  }, [setIssuesN]);

  const onClickRefresh = useCallback(async () => {
    setIsLoadingRefresh(true);
    await refreshData();
    setIsLoadingRefresh(false);
  }, [refreshData]);

  const handleCloseSeed = useCallback(() => {
    onCloseSeed();
    setNumberOfSeed(10);
  }, [onCloseSeed, setNumberOfSeed]);

  const onPressSeed = useCallback(async () => {
    if (typeof numberOfSeed !== 'number' || isNaN(numberOfSeed) || numberOfSeed < 1) return;
    onCloseSeed();
    setIsLoadingSeed(true);
    await seedIssues(window.location.origin + '/api/issues', numberOfSeed);
    setIsLoadingSeed(false);
    setNumberOfSeed(10);
  }, [numberOfSeed, onCloseSeed, setIsLoadingSeed, setNumberOfSeed]);

  const onPressNew = useCallback(() => {
    setIsLoadingNew(true);
    router.push('/issues/new');
  }, [setIsLoadingNew, router]);

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
              onPress={onOpenSeed}
              size='md'
            >
              Seed Issues
            </Button>

            <Modal
              isOpen={isOpenSeed}
              onOpenChange={onOpenChangeSeed}
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
                  <Button color='default' variant='light' onPress={handleCloseSeed}>
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
                {columns
                  .filter(column => column.name !== '')
                  .map(column => (
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
    onOpenSeed,
    isOpenSeed,
    onOpenChangeSeed,
    numberOfSeed,
    handleCloseSeed,
    onPressSeed,
    statusFilter,
    visibleColumns,
    issuesN.length,
    items.length,
    rowsPerPage,
    onRowsPerPageChange,
  ]);

  return {
    topContent,
    items,
    issuesN,
    isLoadingRefresh,
    rowsPerPage,
    statusFilter,
    visibleColumns,
    page,
    setPage,
    sortDescriptor,
    setSortDescriptor,
  };
};

export default TopContentHook;
