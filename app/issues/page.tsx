import { Metadata } from 'next';
import IssuesTable from './data-table';
import { Flex } from '@radix-ui/themes';

export const metadata: Metadata = {
  title: 'Issues',
};

const IssuesPage = async () => {
  return (
    <Flex direction={'column'}>
      <IssuesTable />
    </Flex>
  );
};

export default IssuesPage;

export const dynamic = 'force-dynamic';
