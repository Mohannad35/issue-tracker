import Chip from '@/components/chip';
import { cn } from '@/lib/utils';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import Markdown from 'react-markdown';
import { priorities, statusOptions } from '../utils';

const IssueDetails = ({ issue }: { issue: Issue }) => {
  const status = statusOptions.find(status => status.value === issue.status);
  const priority = priorities.find(priority => priority.value === issue.priority);

  return (
    <>
      <CardHeader className='flex flex-col items-start gap-2'>
        <p className='text-2xl font-medium'>{issue.title}</p>

        <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
          <div className='flex gap-2'>
            {priority && (
              <Chip
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
              <Chip
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
    </>
  );
};

export default IssueDetails;
