'use client';

import { createIssueSchema } from '@/lib/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Id, toast } from 'react-toastify';
import { z } from 'zod';

const NewIssueHook = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');
  let { theme, systemTheme } = useTheme();
  const toastId = useRef<Id | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Define form with zod schema
  const form = useForm<z.infer<typeof createIssueSchema>>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      title: undefined,
      description: undefined,
      priority: 'MEDIUM',
    },
    shouldFocusError: false,
  });

  // Define a submit handler
  async function onSubmit(values: z.infer<typeof createIssueSchema>) {
    // ✅ This will be type-safe and validated values
    setIsLoading(true);
    toastId.current = toast('Adding new issue...', {
      autoClose: false,
      type: 'default',
      isLoading: true,
      theme: theme === 'system' ? systemTheme : (theme as 'dark' | 'light' | undefined),
    });
    // Make a request to the server to create a new issue with the submitted values
    const res = await fetch('/api/issues', {
      body: JSON.stringify(values),
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const { title, slug }: Issue = await res.json();
      toastId.current &&
        toast.update(toastId.current, {
          isLoading: false,
          type: 'success',
          render: `${title} added`,
          autoClose: 3000,
          progress: 0,
        });
      setTimeout(() => {
        router.push(`/issues/${slug}`);
        router.refresh();
      }, 3000);
    } else if (res.status >= 400 && res.status < 500) {
      const { message } = await res.json();
      toastId.current &&
        toast.update(toastId.current, {
          isLoading: false,
          type: 'error',
          render: message || 'An unexpected error occurred. Please try again later.',
          autoClose: 3000,
          progress: 0,
        });
      setTimeout(() => window.location.reload(), 3000);
    } else if (res.status >= 500) {
      toastId.current &&
        toast.update(toastId.current, {
          type: 'error',
          render: 'An unexpected error occurred. Please try again later.',
          autoClose: 3000,
        });
    }
  }

  // form must be exported only once to avoid resetting the form fields
  return {
    onSubmit,
    form,
    loading,
    isLoading,
    toastId,
    theme,
    systemTheme,
  };
};

export default NewIssueHook;
