import prisma from '@/prisma/client';
import { Issue, priorities, statusOptions } from '../utils';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from '@nextui-org/react';
import CustomChip from '@/components/chip';
import { cn } from '@/lib/utils';
import MDEditor from '@uiw/react-md-editor';
import Markdown from 'react-markdown';

interface Props {
  params: { slug: string };
}

const IssuePage = async ({ params: { slug } }: Props) => {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const issue: Issue = await (
    await fetch(`${baseUrl}/api/issues/${slug}`, { method: 'GET' })
  ).json();

  if (!issue) notFound();
  const status = statusOptions.find(status => status.value === issue.status);
  const priority = priorities.find(priority => priority.value === issue.priority);

  return (
    <div className='container'>
      <Card className='bg-transparent' fullWidth shadow='none'>
        <CardHeader className='flex flex-col items-start gap-2'>
          <p className='text-2xl font-medium'>{issue.title}</p>

          <div className='flex justify-between w-full'>
            <div className='flex gap-2'>
              {priority && (
                <CustomChip
                  color={
                    ['secondary', 'primary'].includes(priority.color) ? undefined : priority.color
                  }
                  label={priority.label}
                  variant='faded'
                  icon={priority.icon && <priority.icon />}
                  className={cn({
                    'text-violet-500': priority.color === 'secondary',
                    'text-blue-500': priority.color === 'primary',
                  })}
                />
              )}
              {status && (
                <CustomChip
                  color={['secondary', 'primary'].includes(status.color) ? undefined : status.color}
                  label={status.label}
                  variant='flat'
                  icon={status.icon && <status.icon />}
                  className={cn({
                    'text-violet-500': status.color === 'secondary',
                    'text-blue-500': status.color === 'primary',
                  })}
                />
              )}
            </div>
            <div>
              <p className='text-muted-foreground'>{new Date(issue.createdAt).toDateString()}</p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='w-full px-5'>
          <Card shadow='sm'>
            <CardBody>
              <div className='prose dark:prose-invert'>
                <Markdown>{issue.description}</Markdown>
              </div>
            </CardBody>
          </Card>
        </CardBody>
        <Divider />
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default IssuePage;
