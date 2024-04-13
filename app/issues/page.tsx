import { headers } from 'next/headers';
import IssuesTable from './data-table';
import { Issue } from '@prisma/client';

// This function is used to fetch issues from the server.
async function getIssues() {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const issues: Issue[] = await (
    await fetch(`${baseUrl}/api/issues`, { method: 'GET', cache: 'no-store' })
  ).json();
  return issues;
}

const IssuesPage = async () => {
  const issues = await getIssues();

  return (
    <div className='container flex flex-col w-full space-y-5 pb-5'>
      <IssuesTable issues={issues} />
    </div>
  );
};

export default IssuesPage;

export const dynamic = 'force-dynamic';
