import prisma from '@/prisma/client';
import { Flex, Grid, Heading, Text } from '@radix-ui/themes';
import { Metadata } from 'next';
import IssueChart from '../_components/IssueChart';
import IssueSummary from '../_components/IssueSummary';
import TableLatestIssues from '../_components/table-latest-issues';
import { auth } from '@/auth';
import { User } from '@nextui-org/react';
import Image from 'next/image';

const DashboardPage = async () => {
  const session = await auth();
  const open = await prisma.issue.count({ where: { status: 'OPEN' } });
  const inProgress = await prisma.issue.count({ where: { status: 'IN_PROGRESS' } });
  const closed = await prisma.issue.count({ where: { status: 'CLOSED' } });
  const cancelled = await prisma.issue.count({ where: { status: 'CANCELLED' } });
  const statusCount = { OPEN: open, IN_PROGRESS: inProgress, CLOSED: closed, CANCELLED: cancelled };

  const assignedIssuesCount = await prisma.issue.count({
    where: { assignee: { email: session!.user!.email } },
  });

  return (
    <Flex gap='5' direction='column'>
      {session?.user && (
        <Flex
          direction={{ initial: 'column', xs: 'row' }}
          gap='5'
          width='100%'
          justify='between'
          align='center'
        >
          <User
            name={<Heading>{session.user?.name}</Heading>}
            avatarProps={{
              size: 'lg',
              showFallback: true,
              alt: 'User avatar image',
              src: session.user?.image || undefined,
              ImgComponent: Image,
              imgProps: { width: 128, height: 128 },
            }}
            className='transition-transform justify-start'
            description={<Text size='3'>{session.user?.email}</Text>}
          />
          <Text size='4'>
            Assigned Issues: <Text size='5'>{assignedIssuesCount}</Text>
          </Text>
        </Flex>
      )}

      <Grid columns={{ initial: '1', md: '2' }} gap='5'>
        <Flex direction='column' gap='5'>
          <IssueSummary statusCount={statusCount} />
          <IssueChart statusCount={statusCount} />
        </Flex>
        <TableLatestIssues />
      </Grid>
    </Flex>
  );
};

export default DashboardPage;

export const metadata: Metadata = {
  title: 'Issue Tracker - Dashboard',
  description: 'View a summary of project issues',
};
