'use client';

import { Icons } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Pagination } from '@nextui-org/pagination';
import { Select, SelectItem } from '@nextui-org/select';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Issue } from '@prisma/client';
import { Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { capitalize } from 'lodash';
import { DatabaseBackupIcon, PlusCircleIcon, RefreshCw, Search } from 'lucide-react';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { columns, statusOptions } from './_components/utils';
import DataTableHook from './data-table-hook';
import { useEffect } from 'react';

export default function IssuesTable() {
  const searchParams = useSearchParams();
  const { data: issues, isSuccess, error, isLoading, refetch } = useIssues(searchParams);
  const {
    hasSearchFilter,
    filterValue,
    statusFilter,
    sortDescriptor,
    rowsPerPage,
    page,
    isOpenSeed,
    onOpenChangeSeed,
    numberOfSeed,
    setNumberOfSeed,
    handleCloseSeed,
    onPressSeed,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    isLoadingRefresh,
    isLoadingSeed,
    isLoadingNew,
    onPressNew,
    isOpenDelete,
    onOpenChangeDelete,
    onCloseDelete,
    handleDelete,
    selectedKeys,
    setSelectedKeys,
    onOpenSeed,
    setPage,
    onRowsPerPageChange,
    visibleColumns,
    setVisibleColumns,
    renderCell,
    loadingContent,
    headerColumns,
    setStatusFilter,
    status,
    setSortDescriptor,
    issue,
    handleSortChange,
  } = DataTableHook(refetch, searchParams);

  if (isLoading) return <p>Loading...</p>;
  else if (error) return <p>Error: {error.message}</p>;
  else if (isSuccess) {
    const items = issues;
    const pages = Math.ceil(items.length / rowsPerPage);
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = items.slice(start, end);

    const topContent = (
      <div className='flex flex-col gap-4'>
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

        <Flex
          direction={{ initial: 'column', md: 'row' }}
          justify={'between'}
          gap={'12px'}
          align={'end'}
        >
          <Flex justify={'start'} width={'100%'}>
            <Input
              isClearable
              classNames={{
                base: 'w-full sm:max-w-[36rem]',
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
          </Flex>
          <Flex direction={{ initial: 'column', sm: 'row' }} gap={'12px'}>
            <Flex direction={{ initial: 'column', xs: 'row' }} gap={'12px'}>
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

              {status === 'authenticated' && (
                <>
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
                </>
              )}
            </Flex>

            <Flex direction={{ initial: 'column', xs: 'row' }} gap={'12px'} justify={'end'}>
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
            </Flex>
          </Flex>
        </Flex>
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

    const bottomContent = (
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

    return (
      <>
        <Table
          isHeaderSticky
          showSelectionCheckboxes
          selectionMode='multiple'
          bottomContentPlacement='outside'
          topContentPlacement='outside'
          checkboxesProps={{ color: 'primary' }}
          classNames={{ wrapper: 'max-h-[640px]' }}
          aria-label='Issues table showing all issues with sorting and filtering options'
          selectedKeys={selectedKeys}
          sortDescriptor={sortDescriptor}
          bottomContent={bottomContent}
          topContent={topContent}
          onSelectionChange={setSelectedKeys}
          onSortChange={handleSortChange}
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
            loadingContent={loadingContent}
            emptyContent={'No issues found'}
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
}

const useIssues = (searchParams: ReadonlyURLSearchParams) => {
  const isValid = searchParams.has('status') || searchParams.has('filter');
  const query = searchParams.toString();
  return useQuery<Issue[]>({
    queryKey: ['issues'],
    queryFn: () => fetch(`/api/issues${isValid ? `?${query}` : ''}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
