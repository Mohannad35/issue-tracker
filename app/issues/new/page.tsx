'use client';

import { Form } from '@/components/ui/form';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import NewIssueHook from './new-issue-hook';
import {
  DescriptionFormField,
  PriorityFormField,
  SubmitButton,
  TitleFormField,
} from '@/app/issues/_components';
import { PlusIcon } from 'lucide-react';

export default function NewIssuePage() {
  const { form, onSubmit, loading, theme, systemTheme, isLoading } = NewIssueHook();

  return (
    <div className='container flex justify-center flex-col w-[50rem] space-y-5'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <Card className='p-5'>
            <CardHeader>
              <p className='text-3xl font-medium'>New Issue</p>
            </CardHeader>

            <CardBody className='space-y-5'>
              <TitleFormField formControl={form.control} />
              <DescriptionFormField
                formControl={form.control}
                loading={loading}
                systemTheme={systemTheme}
                theme={theme}
              />
              <PriorityFormField formControl={form.control} />
            </CardBody>

            <CardFooter>
              <SubmitButton isLoading={isLoading} Icon={<PlusIcon />} label='New Issue' />
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
