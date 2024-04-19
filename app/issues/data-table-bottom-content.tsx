'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@nextui-org/pagination';
import { Selection } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { Flex } from '@radix-ui/themes';
import { Dispatch, SetStateAction } from 'react';

const BottomContent = (props: BottomContentProps) => {
  const { issues, rowsPerPage, page, selectedKeys, isLoadingRefresh, setPage } = props;
  const pages = Math.ceil(issues.length / rowsPerPage);

  return (
    <Flex justify='between' align='center' minHeight='51px'>
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
          : `${selectedKeys.size} of ${issues.length} selected`}
      </span>
    </Flex>
  );
};

export default BottomContent;

interface BottomContentProps {
  issues: Issue[];
  rowsPerPage: number;
  page: number;
  selectedKeys: Selection;
  isLoadingRefresh: boolean;
  setPage: Dispatch<SetStateAction<number>>;
}
