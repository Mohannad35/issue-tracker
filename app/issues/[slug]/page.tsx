import { Card, CardFooter, Divider } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import DeleteIssueButton from './delete-issue-button';
import EditIssueButton from './edit-issue-button';
import IssueDetails from './issue-details';

interface Props {
  params: { slug: string };
}

const IssuePage = async ({ params: { slug } }: Props) => {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const issue: Issue = await (
    await fetch(`${baseUrl}/api/issues/${slug}`, { method: 'GET' })
  ).json();

  if (!issue) notFound();

  return (
    <div className='container'>
      <Card className='bg-transparent' fullWidth shadow='none'>
        <IssueDetails issue={issue} />
        <Divider />
        <CardFooter>
          <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
            <EditIssueButton issueSlug={issue.slug} baseUrl={baseUrl} />
            <DeleteIssueButton issueTitle={issue.title} />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IssuePage;
