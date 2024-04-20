import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';
import IssueSummary from './IssueSummary';
import TableLatestIssues from './table-latest-issues';
import prisma from '@/prisma/client';

export const metadata: Metadata = {
  title: 'Issue Tracker',
  description: 'Issue Tracker application built with Next.js and Prisma',
};

export default async function Home() {
  const open = await prisma.issue.count({ where: { status: 'OPEN' } });
  const inProgress = await prisma.issue.count({ where: { status: 'IN_PROGRESS' } });
  const closed = await prisma.issue.count({ where: { status: 'CLOSED' } });
  const cancelled = await prisma.issue.count({ where: { status: 'CANCELLED' } });

  return (
    <Flex direction='column' gap='2'>
      <TableLatestIssues />
      <IssueSummary open={open} inProgress={inProgress} closed={closed} cancelled={cancelled} />
    </Flex>
  );
}
