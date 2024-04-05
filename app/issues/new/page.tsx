'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react';
import MDEditor from '@uiw/react-md-editor';
import { PlusIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { issueFormSchema } from './issueFormSchema';

export default function NewIssuesPage() {
  const { theme } = useTheme();
  const [sysTheme, setSysTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const prefersDarkMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSysTheme(prefersDarkMode ? 'dark' : 'light');
  }, [theme]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof issueFormSchema>>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      title: undefined,
      description: undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof issueFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setIsLoading(true);
    const res = await fetch('/api/issues', {
      body: JSON.stringify(values),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      setTimeout(() => {
        router.push('/issues');
      }, 1000);
    } else {
      console.log(res);
      setIsLoading(false);
      // Show error message using toast or something and reset the form
    }
  }

  return (
    <div className='container flex justify-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Card className='p-5 w-[40rem]'>
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
                      {/* <Input placeholder='shadcn' {...field} /> */}
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
