import { Issue } from '@prisma/client';
import { notFound } from 'next/navigation';
import EditIssueForm from './edit-issue-form';
import { headers } from 'next/headers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Issue',
};

// This function is used to fetch issue from the server.
async function getIssue(slug: string) {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const API = `${baseUrl}/api/issues/${slug}`;
  return await (await fetch(API, { cache: 'no-store' })).json();
}

export default async function EditIssuePage({ params: { slug } }: { params: { slug: string } }) {
  const issue: Issue = await getIssue(slug);

  if (!issue) notFound();

  return (
    <div className='flex w-full justify-center'>
      <EditIssueForm issue={issue} />
    </div>
  );
}
