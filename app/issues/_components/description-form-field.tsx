'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import MDEditor from '@uiw/react-md-editor';
import { Control } from 'react-hook-form';

const DescriptionFormField = ({
  formControl,
  loading,
  theme,
  systemTheme,
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
  loading: boolean;
  theme: string | undefined;
  systemTheme: 'dark' | 'light' | undefined;
}) => {
  return (
    <FormField
      control={formControl}
      name='description'
      render={({ field }) => (
        <FormItem className='h-full'>
          <FormLabel className='text-muted-foreground'>Description</FormLabel>
          <FormLabel className='text-red-500'>*</FormLabel>
          <FormControl>
            <div>
              {loading ? (
                <Skeleton className='w-full h-[400px] rounded-lg' />
              ) : (
                <MDEditor
                  data-color-mode={
                    theme === 'system' ? systemTheme : (theme as 'dark' | 'light' | undefined)
                  }
                  textareaProps={{ placeholder: 'Please enter issue description' }}
                  minHeight={300}
                  height={400}
                  maxHeight={500}
                  {...field}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DescriptionFormField;
