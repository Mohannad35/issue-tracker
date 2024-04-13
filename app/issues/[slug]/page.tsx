import { Card, CardFooter, Divider } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import DeleteIssueButton from './delete-issue-button';
import EditIssueButton from './edit-issue-button';
import IssueDetails from './issue-details';

// This function is used to fetch issue from the server.
async function getIssue(slug: string) {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const API = `${baseUrl}/api/issues/${slug}`;
  return await (await fetch(API, { cache: 'no-store' })).json();
}

const IssuePage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const baseUrl = `${headers().get('x-forwarded-proto')}://${headers().get('host')}`;

  const issue: Issue = await getIssue(slug);

  if (!issue) notFound();

  return (
    <div className='container'>
      <Card className='bg-transparent' fullWidth shadow='none'>
        <IssueDetails issue={issue} />
        <Divider />
        <CardFooter>
          <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
            <EditIssueButton issueSlug={issue.slug} baseUrl={baseUrl} />
            <DeleteIssueButton issue={issue} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IssuePage;
