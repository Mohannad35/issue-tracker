import { Card } from '@nextui-org/react';
import { Status } from '@prisma/client';
import { Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';

const IssueSummary = ({ open, inProgress, closed, cancelled }: IssueSummaryProps) => {
  const containers: {
    label: string;
    count: number;
    status: Status;
  }[] = [
    { label: 'Open Issues', count: open, status: 'OPEN' },
    { label: 'In-progress Issues', count: inProgress, status: 'IN_PROGRESS' },
    { label: 'Closed Issues', count: closed, status: 'CLOSED' },
    { label: 'Cancelled Issues', count: cancelled, status: 'CANCELLED' },
  ];

  return (
    <Flex gap='3'>
      {containers.map(({ label, count, status }) => (
        <Card key={status} radius='sm' className='p-3 bg-transparent shadow-none border'>
          <Flex direction='column' gap='1'>
            <Link href={`/issues?status=${status}`} className='text-small font-medium'>
              {label}
            </Link>
            <Text size='5' weight='bold'>
              {count}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;

interface IssueSummaryProps {
  open: number;
  inProgress: number;
  closed: number;
  cancelled: number;
}
