'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { useMemo, useState } from 'react';
import { columns } from './_components/utils';
import BottomContentHook from './bottom-content';
import RenderCellHook from './render-cell-callback';
import TopContentHook from './top-content';

export default function IssuesTable({ issues }: { issues: Issue[] }) {
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const { issue, isOpenDelete, renderCell, handleDelete, onOpenChangeDelete, onCloseDelete } =
    RenderCellHook();
  const {
    items,
    isLoadingRefresh,
    page,
    rowsPerPage,
    setPage,
    topContent,
    visibleColumns,
    sortDescriptor,
    setSortDescriptor,
  } = TopContentHook(issues);
  const { bottomContent, pageItems } = BottomContentHook(
    items,
    page,
    setPage,
    isLoadingRefresh,
    rowsPerPage,
    selectedKeys
  );

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter(column => Array.from(visibleColumns).includes(column.value));
  }, [visibleColumns]);

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
