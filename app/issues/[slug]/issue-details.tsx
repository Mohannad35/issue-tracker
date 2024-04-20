import Chip from '@/components/chip';
import { cn } from '@/lib/utils';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import Markdown from 'react-markdown';
import { priorities, statusOptions } from '../_components/utils';
import ChipPriority from '@/app/_components/chip-priority';
import ChipStatus from '@/app/_components/chip-status';
import { Box, Flex, Heading, Text } from '@radix-ui/themes';

const IssueDetails = ({ issue }: { issue: Issue }) => {
  const { title, description, priority, status, createdAt } = issue;

  return (
    <>
      <CardHeader className='flex flex-col items-start gap-2'>
        <Heading>{title}</Heading>

        <Flex
          gap='2'
          width='100%'
          direction={{ initial: 'column', xs: 'row' }}
          justify={{ initial: 'start', xs: 'between' }}
        >
          <Flex gap='2'>
            {priority && <ChipPriority priority={priority} />}
            {status && <ChipStatus status={status} />}
          </Flex>
          <Text className='text-muted-foreground'>{new Date(createdAt).toDateString()}</Text>
        </Flex>
      </CardHeader>
      <Divider />
      <CardBody className='w-full px-5'>
        <Card shadow='sm'>
          <CardBody>
            <div className='prose dark:prose-invert'>
              <Markdown>{description}</Markdown>
            </div>
          </CardBody>
        </Card>
      </CardBody>
    </>
  );
};

export default IssueDetails;
