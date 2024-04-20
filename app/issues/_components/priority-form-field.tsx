'use client';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Select, SelectItem } from '@nextui-org/react';
import { priorities } from './utils';
import { Control } from 'react-hook-form';
import { Priority, Status } from '@prisma/client';

const PriorityFormField = ({
  formControl,
}: {
  formControl: Control<
    {
      title: string;
      description: string;
      status?: Status | undefined;
      priority?: Priority | undefined;
    },
    any
  >;
}) => {
  return (
    <FormField
      control={formControl}
      name='priority'
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select
              isRequired
              variant='underlined'
              label='Select a priority'
              selectionMode='single'
              defaultSelectedKeys={[field.value || 'MEDIUM']}
              {...field}
            >
              {priorities.map(priority => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
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

export default PriorityFormField;
