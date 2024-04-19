'use client';

import { Button } from '@nextui-org/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown';
import { Selection } from '@nextui-org/table';
import { capitalize } from 'lodash';
import { ChevronDownIcon } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { statusOptions } from './_components/utils';

const DropdownStatus = ({ statusFilter, setStatusFilter }: DropdownStatusProps) => {
  return (
    <Dropdown>
      <DropdownTrigger className='hidden sm:flex'>
        <Button
          endContent={<ChevronDownIcon className='text-small' />}
          size='md'
          color='default'
          variant='ghost'
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
  );
};

export default DropdownStatus;

interface DropdownStatusProps {
  statusFilter: Selection;
  setStatusFilter: Dispatch<SetStateAction<Selection>>;
}
