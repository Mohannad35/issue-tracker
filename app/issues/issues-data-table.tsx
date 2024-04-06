'use client';

import { useEffect, useState } from 'react';
import { columns } from './components/coloumns';
import { DataTable } from './components/data-table';
import { Issue } from './components/issue-schema';
import TableNextUi from './components/nextui/data-table';

export async function getIssues() {
  // const headersList = headers();
  // const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const issues: Issue[] = await (await fetch('/api/issues', { method: 'GET' })).json();
  return issues;
}

const IssuesDataTable = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getIssues().then(issues => {
      setIssues(issues);
      setLoading(false);
    });
  }, []);

  const refreshData = async () => {
    setLoading(true);
    const issues = await getIssues();
    setIssues(issues);
    setLoading(false);
  };
  return (
    <div className='flex flex-col space-y-10'>
      <TableNextUi issues={issues} />
      <DataTable data={issues} columns={columns} refreshData={refreshData} loading={loading} />
    </div>
  );
};

export default IssuesDataTable;
