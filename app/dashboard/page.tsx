import prisma from '@/prisma/client';
import { Flex, Grid } from '@radix-ui/themes';
import { Metadata } from 'next';
import IssueChart from '../_components/IssueChart';
import IssueSummary from '../_components/IssueSummary';
import TableLatestIssues from '../_components/table-latest-issues';

const DashboardPage = async () => {
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
    </Flex>
  );
};

export default DashboardPage;

export const metadata: Metadata = {
  title: 'Issue Tracker - Dashboard',
  description: 'View a summary of project issues',
};
