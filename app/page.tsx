import prisma from '@/prisma/client';
import { Flex, Grid } from '@radix-ui/themes';
import { Metadata } from 'next';
import IssueChart from './IssueChart';
import IssueSummary from './IssueSummary';
import TableLatestIssues from './table-latest-issues';

export const metadata: Metadata = {
  title: 'Issue Tracker',
  description: 'Issue Tracker application built with Next.js and Prisma',
};

export default async function Home() {
  const open = await prisma.issue.count({ where: { status: 'OPEN' } });
  const inProgress = await prisma.issue.count({ where: { status: 'IN_PROGRESS' } });
  const closed = await prisma.issue.count({ where: { status: 'CLOSED' } });
  const cancelled = await prisma.issue.count({ where: { status: 'CANCELLED' } });
  const statusCount = { OPEN: open, IN_PROGRESS: inProgress, CLOSED: closed, CANCELLED: cancelled };

  return (
    <Flex gap='5' direction='column'>
      <Grid columns={{ initial: '1', md: '2' }} gap='5'>
        <Flex direction='column' gap='5'>
          <IssueSummary statusCount={statusCount} />
          <IssueChart statusCount={statusCount} />
        </Flex>
        <TableLatestIssues />
      </Grid>

      {/* <ResizablePanelGroup direction='horizontal' className='gap-2.5'>
        <ResizablePanel defaultSize={50}>
          <Flex direction='column' gap='5' height='100%'>
            <IssueSummary statusCount={statusCount} />
            <IssueChart statusCount={statusCount} />
          </Flex>
        </ResizablePanel>
        <ResizableHandle withHandle className='bg-transparent' />
        <ResizablePanel defaultSize={50}>
          <Flex direction='column' gap='5'>
            <TableLatestIssues />
          </Flex>
        </ResizablePanel>
      </ResizablePanelGroup> */}
    </Flex>
  );
}
