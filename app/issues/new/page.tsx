'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createIssueSchema } from '@/lib/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import MDEditor from '@uiw/react-md-editor';
import { PlusIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function NewIssuesPage() {
  const [sysTheme, setSysTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSysTheme(prefersDarkMode ? 'dark' : 'light');
  }, [theme]);

  // Define form with zod schema
  const form = useForm<z.infer<typeof createIssueSchema>>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: undefined,
      description: undefined,
    },
    shouldFocusError: false,
  });

  // Define a submit handler
  async function onSubmit(values: z.infer<typeof createIssueSchema>) {
    // ✅ This will be type-safe and validated values
    setError('');
    setIsLoading(true);
    // Make a request to the server to create a new issue with the submitted values
    const res = await fetch('/api/issues', {
      body: JSON.stringify(values),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) setTimeout(() => router.push('/issues'), 1000);
    else {
      console.log(res);
      setError('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
    }
  }

  return (
    <div className='container flex justify-center flex-col w-[50rem] space-y-5'>
      {error && (
        <Alert variant='destructive'>
          <ExclamationTriangleIcon className='h-4 w-4' />
          <AlertTitle>Unexpected error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Card className='p-5'>
            <CardHeader>
              <p className='text-3xl font-medium'>New Issue</p>
            </CardHeader>

            <CardBody className='space-y-5'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input label='Title' variant='underlined' isRequired {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground'>Description</FormLabel>
                    <FormLabel className='text-red-500'>*</FormLabel>
                    <FormControl>
                      <MDEditor
                        data-color-mode={
                          theme === 'system'
                            ? sysTheme === 'dark'
                              ? 'dark'
                              : 'light'
                            : theme === 'dark'
                            ? 'dark'
                            : 'light'
                        }
                        textareaProps={{ placeholder: 'Please enter issue description' }}
                        minHeight={300}
                        height={300}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardBody>

            <CardFooter>
              <Button
                fullWidth
                type='submit'
                color='primary'
                variant='solid'
                startContent={<PlusIcon />}
                isLoading={isLoading}
                spinnerPlacement='end'
                className='text-base font-semibold'
              >
                New Issue
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
