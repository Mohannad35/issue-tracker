'use client';

import { Form } from '@/components/ui/form';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import EditIssueHook from './edit-issue-hook';
import {
  TitleFormField,
  DescriptionFormField,
  PriorityFormField,
  SubmitButton,
} from '@/app/issues/_components';
import { SquarePen } from 'lucide-react';
import { Issue } from '@prisma/client';

const EditIssueForm = ({ issue }: { issue: Issue }) => {
  const { form, onSubmit, loading, theme, systemTheme, isLoading } = EditIssueHook(issue);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card className='p-5'>
          <CardHeader>
            <p className='text-3xl font-medium'>Update Issue</p>
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
            <SubmitButton isLoading={isLoading} label='Update Issue' Icon={<SquarePen />} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EditIssueForm;
