'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, Selection } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { Dispatch, SetStateAction, useMemo } from 'react';

const BottomContentHook = (
  items: Issue[],
  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  isLoadingRefresh: boolean,
  rowsPerPage: number,
  selectedKeys: Selection
) => {
  const pages = useMemo(() => Math.ceil(items.length / rowsPerPage), [items.length, rowsPerPage]);
  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return items.slice(start, end);
  }, [page, rowsPerPage, items]);

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
  }, [isLoadingRefresh, page, pages, setPage, selectedKeys, items.length]);

  return { bottomContent, pageItems };
};

export default BottomContentHook;
