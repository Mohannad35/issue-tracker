import { Issue } from '@prisma/client';
import { notFound } from 'next/navigation';
import EditIssueForm from './edit-issue-form';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import prisma from '@/prisma/client';

export const metadata: Metadata = {
  title: 'Edit Issue',
};

export default async function EditIssuePage({ params: { slug } }: { params: { slug: string } }) {
  const issue = await prisma.issue.findUnique({ where: { slug } });

  if (!issue) notFound();

  return (
    <div className='flex w-full justify-center'>
      <EditIssueForm issue={issue} />
    </div>
  );
}

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  const issue = await prisma.issue.findUnique({ where: { slug } });

  return {
    title: `Edit: ${issue?.title}`,
    description: `Editing issue ${issue?.title}`,
  };
}
