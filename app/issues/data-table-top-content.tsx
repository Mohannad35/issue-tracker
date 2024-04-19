'use client';

import { Input } from '@nextui-org/input';
import { Selection } from '@nextui-org/table';
import { Issue } from '@prisma/client';
import { Box, Flex, Text } from '@radix-ui/themes';
import { Search } from 'lucide-react';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import ControlButtons from './buttons-control';
import SelectRowsPerPage from './select-rows-per-page';
import DropdownColumns from './dropdown-columns';
import DropdownStatus from './dropdown-status';
import ModalSeed from './modal-seed-issues';

const TopContent = (props: TopContentProps) => {
  const {
    issues,
    status,
    filterValue,
    statusFilter,
    rowsPerPage,
    numberOfSeed,
    visibleColumns,
    isOpenSeed,
    isLoadingRefresh,
    isLoadingSeed,
    isLoadingNew,
    onOpenChangeSeed,
    setNumberOfSeed,
    handleCloseSeed,
    onPressSeed,
    setFilterValue,
    onSearchChange,
    onClickRefresh,
    onPressNew,
    onOpenSeed,
    onRowsPerPageChange,
    setVisibleColumns,
    setStatusFilter,
  } = props;

  return (
    <Flex className='flex flex-col gap-4'>
      <ModalSeed
        handleCloseSeed={handleCloseSeed}
        isOpenSeed={isOpenSeed}
        numberOfSeed={numberOfSeed}
        onOpenChangeSeed={onOpenChangeSeed}
        onPressSeed={onPressSeed}
        setNumberOfSeed={setNumberOfSeed}
      />

      <Flex
        direction={{ initial: 'column', md: 'row' }}
        justify={'between'}
        gap={'12px'}
        align={'end'}
      >
        <Flex justify={'start'} width={'100%'}>
          <Input
            isClearable
            size='md'
            color='primary'
            variant='bordered'
            className='group'
            classNames={{
              base: 'w-full sm:max-w-[36rem]',
            }}
            placeholder='Search by title...'
            startContent={
              <Search className='text-default-300 group-focus-within:text-default-700 transition-colors ease-in-out duration-75' />
            }
            value={filterValue}
            onValueChange={onSearchChange}
            onClear={() => setFilterValue('')}
          />
        </Flex>

        <Flex direction={{ initial: 'column', sm: 'row' }} gap={'12px'}>
          <Flex direction={{ initial: 'column', xs: 'row' }} gap={'12px'}>
            <ControlButtons
              isLoadingNew={isLoadingNew}
              isLoadingRefresh={isLoadingRefresh}
              isLoadingSeed={isLoadingSeed}
              onClickRefresh={onClickRefresh}
              onOpenSeed={onOpenSeed}
              onPressNew={onPressNew}
              status={status}
            />
          </Flex>

          <Flex direction={{ initial: 'column', xs: 'row' }} gap={'12px'} justify={'end'}>
            <DropdownStatus statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
            <DropdownColumns
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex justify='between' align='center'>
        <Box>
          <Text size='2' className='text-muted-foreground'>
            {'Found ' + issues.length + ' of ' + issues.length + ' issues'}
          </Text>
        </Box>
        <SelectRowsPerPage onRowsPerPageChange={onRowsPerPageChange} rowsPerPage={rowsPerPage} />
      </Flex>
    </Flex>
  );
};

export default TopContent;

interface TopContentProps {
  issues: Issue[];
  status: 'authenticated' | 'loading' | 'unauthenticated';
  filterValue: string | undefined;
  statusFilter: Selection;
  rowsPerPage: number;
  numberOfSeed: number;
  visibleColumns: Selection;
  isOpenSeed: boolean;
  isLoadingRefresh: boolean;
  isLoadingSeed: boolean;
  isLoadingNew: boolean;
  onOpenChangeSeed: () => void;
  setNumberOfSeed: Dispatch<SetStateAction<number>>;
  handleCloseSeed: () => void;
  onPressSeed: () => Promise<void>;
  setFilterValue: Dispatch<SetStateAction<string | undefined>>;
  onSearchChange: (value?: string) => void;
  onClickRefresh: () => Promise<void>;
  onPressNew: () => void;
  onOpenSeed: () => void;
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  setVisibleColumns: Dispatch<SetStateAction<Selection>>;
  setStatusFilter: Dispatch<SetStateAction<Selection>>;
}
