import { Metadata } from 'next';
import IssuesTable from './data-table';
import { Flex } from '@radix-ui/themes';

const IssuesPage = async () => {
  return (
    <Flex direction={'column'}>
      <IssuesTable />
    </Flex>
  );
};

export default IssuesPage;

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Issue Tracker - Issues List',
  description: 'View all project issues',
};
