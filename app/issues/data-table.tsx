'use client';

import { Button } from '@nextui-org/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { Issue } from '@prisma/client';
import { Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import BottomContent from './data-table-bottom-content';
import DataTableHook from './data-table-hook';
import TopContent from './data-table-top-content';

export default function IssuesTable() {
  const searchParams = useSearchParams();
  const { data: issues, isSuccess, error, isLoading, refetch } = useIssues(searchParams);
  const {
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
  } = DataTableHook(refetch);

  if (isLoading) return loadingContent;
  else if (error) return <p>Error: {error.message}</p>;
  else if (isSuccess) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = issues.slice(start, end);

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
          bottomContent={
            <BottomContent
              issues={issues}
              isLoadingRefresh={isLoadingRefresh}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedKeys={selectedKeys}
              setPage={setPage}
            />
          }
          topContent={
            <TopContent
              issues={issues}
              filterValue={filterValue}
              handleCloseSeed={handleCloseSeed}
              isLoadingNew={isLoadingNew}
              isLoadingRefresh={isLoadingRefresh}
              isLoadingSeed={isLoadingSeed}
              isOpenSeed={isOpenSeed}
              numberOfSeed={numberOfSeed}
              onClickRefresh={onClickRefresh}
              onOpenChangeSeed={onOpenChangeSeed}
              onOpenSeed={onOpenSeed}
              onPressNew={onPressNew}
              onPressSeed={onPressSeed}
              onRowsPerPageChange={onRowsPerPageChange}
              onSearchChange={onSearchChange}
              rowsPerPage={rowsPerPage}
              setFilterValue={setFilterValue}
              setNumberOfSeed={setNumberOfSeed}
              setStatusFilter={setStatusFilter}
              setVisibleColumns={setVisibleColumns}
              status={status}
              statusFilter={statusFilter}
              visibleColumns={visibleColumns}
            />
          }
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
              <Text>This Action can&apos;t be undone.</Text>
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
  const isValid =
    searchParams.has('status') || searchParams.has('sortBy') || searchParams.has('search');
  const query = searchParams.toString();
  return useQuery<Issue[]>({
    queryKey: ['issues'],
    queryFn: () => fetch(`/api/issues${isValid ? `?${query}` : ''}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
