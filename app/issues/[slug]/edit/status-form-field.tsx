'use client';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectItem } from '@nextui-org/react';
import { Control } from 'react-hook-form';
import { statusOptions } from '../../_components/utils';

const StatusFormField = ({
  formControl,
}: {
  formControl: Control<
    {
      title: string;
      description: string;
      status?: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | undefined;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | undefined;
    },
    any
  >;
}) => {
  return (
    <FormField
      control={formControl}
      name='status'
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              isRequired
              variant='underlined'
              label='Select a status'
              selectionMode='single'
              defaultSelectedKeys={[field.value || 'OPEN']}
              {...field}
            >
              {statusOptions.map(status => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatusFormField;
