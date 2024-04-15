'use client';

import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@nextui-org/react';
import { Control } from 'react-hook-form';

const TitleFormField = ({
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
      name='title'
      render={({ field }) => (
        <FormItem className='w-full max-w-[40rem] sm:w-1/2'>
          <FormControl>
            <Input label='Title' variant='underlined' isRequired {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TitleFormField;
