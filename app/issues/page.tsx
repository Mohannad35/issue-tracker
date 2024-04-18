import { Metadata } from 'next';
import IssuesTable from './data-table';

export const metadata: Metadata = {
  title: 'Issues',
};

const IssuesPage = async () => {
  return (
    <div className='flex flex-col w-full space-y-5 pb-5'>
      <IssuesTable />
    </div>
  );
};

export default IssuesPage;

export const dynamic = 'force-dynamic';
