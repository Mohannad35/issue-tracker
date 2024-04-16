import { Card, CardFooter, Divider } from '@nextui-org/react';
import { Issue, User } from '@prisma/client';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import DeleteIssueButton from './delete-issue-button';
import EditIssueButton from './edit-issue-button';
import IssueDetails from './issue-details';
import { Metadata } from 'next';
import { auth } from '@/auth';
import AssigningIssue from './AssigningIssue';

export const metadata: Metadata = {
  title: 'Issue Details',
};

// This function is used to fetch issue from the server.
async function getIssue(slug: string) {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const API = `${baseUrl}/api/issues/${slug}`;
  return await (await fetch(API, { cache: 'no-store' })).json();
}

async function getUsers() {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const API = `${baseUrl}/api/users`;
  return await (await fetch(API, { next: { revalidate: 300 } })).json();
}

const IssuePage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const issue: Issue = await getIssue(slug);
  const users: User[] = await getUsers();
  const baseUrl = `${headers().get('x-forwarded-proto')}://${headers().get('host')}`;
  if (!issue) notFound();

  const session = await auth();

  return (
    <div>
      <Card className='bg-transparent' fullWidth shadow='none'>
        <IssueDetails issue={issue} />
        <Divider />
        <CardFooter>
          {session && (
            <div className='flex flex-col md:flex-row gap-2 justify-between w-full'>
              <AssigningIssue users={users} />
              <div className='flex flex-col sm:flex-row gap-2 justify-end'>
                <EditIssueButton issueSlug={issue.slug} baseUrl={baseUrl} />
                <DeleteIssueButton issue={issue} />
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default IssuePage;
