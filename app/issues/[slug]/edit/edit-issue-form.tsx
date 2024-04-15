'use client';

import {
  DescriptionFormField,
  PriorityFormField,
  SubmitButton,
  TitleFormField,
} from '@/app/issues/_components';
import { Form } from '@/components/ui/form';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { SquarePen } from 'lucide-react';
import EditIssueHook from './edit-issue-hook';
import StatusFormField from './status-form-field';

const EditIssueForm = ({ issue }: { issue: Issue }) => {
  const { form, onSubmit, loading, theme, systemTheme, isLoading } = EditIssueHook(issue);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full gap-8'>
        <Card className='bg-transparent'>
          <CardHeader>
            <p className='text-3xl font-medium'>Update Issue</p>
          </CardHeader>

          <CardBody className='gap-5'>
            <TitleFormField formControl={form.control} />
            <DescriptionFormField
              formControl={form.control}
              loading={loading}
              systemTheme={systemTheme}
              theme={theme}
            />
            <div className='flex gap-8 justify-between w-full max-sm:flex-col'>
              <div className='w-full'>
                <PriorityFormField formControl={form.control} />
              </div>
              <div className='w-full'>
                <StatusFormField formControl={form.control} />
              </div>
            </div>
          </CardBody>

          <CardFooter>
            <SubmitButton isLoading={isLoading} label='Update Issue' Icon={<SquarePen />} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditIssueForm;
