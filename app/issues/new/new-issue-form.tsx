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

const NewIssueForm = () => {
  const { form, onSubmit, loading, theme, systemTheme, isLoading } = NewIssueHook();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full gap-8'>
        <Card className='bg-transparent'>
          <CardHeader>
            <p className='text-3xl font-medium'>New Issue</p>
          </CardHeader>

          <CardBody className='gap-5'>
            <TitleFormField formControl={form.control} />
            <DescriptionFormField
              formControl={form.control}
              loading={loading}
              systemTheme={systemTheme}
              theme={theme}
            />
            <div className='w-full max-w-[40rem] sm:w-1/2'>
              <PriorityFormField formControl={form.control} />
            </div>
          </CardBody>

          <CardFooter>
            <SubmitButton isLoading={isLoading} Icon={<PlusIcon />} label='New Issue' />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default NewIssueForm;
