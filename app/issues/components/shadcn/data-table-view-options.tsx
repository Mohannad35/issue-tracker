'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  refreshData: () => Promise<void>;
}

export function DataTableViewOptions<TData>({
  table,
  refreshData,
}: DataTableViewOptionsProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);
  const onClickRefresh = async () => {
    setIsLoading(true);
    await refreshData();
    setIsLoading(false);
  };

  return (
    <div className='flex'>
      <Button
        onClick={onClickRefresh}
        variant='outline'
        size='icon'
        className='ml-auto hidden h-8 lg:flex'
      >
        <RefreshCw className={cn('h-4 w-4', { 'animate-spin': isLoading })} />
        <span className='sr-only'>Refresh table data</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='ml-2 hidden h-8 lg:flex'>
            <MixerHorizontalIcon className='mr-2 h-4 w-4' />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[150px]'>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .map(column => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={value => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
