import { auth } from '@/auth';
import { Card, CardFooter, Divider } from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import AssigningIssue from './AssigningIssue';
import DeleteIssueButton from './delete-issue-button';
import EditIssueButton from './edit-issue-button';
import IssueDetails from './issue-details';

export const metadata: Metadata = {
  title: 'Issue Details',
};

// This function is used to fetch issue from the server.
async function getIssue(slug: string, baseUrl: string) {
  const API = `${baseUrl}/api/issues/${slug}`;
  return await (await fetch(API, { cache: 'no-store' })).json();
}

const IssuePage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const headersList = headers();
  const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const issue: Issue = await getIssue(slug, baseUrl);
  if (!issue) notFound();
  const session = await auth();

  return (
    <Card className='bg-transparent' fullWidth shadow='none'>
      <IssueDetails issue={issue} />
      <Divider />
      <CardFooter>
        {session && (
          <Flex
            width='100%'
            direction={{ initial: 'column', sm: 'row' }}
            gap='8px'
            justify='between'
          >
            <AssigningIssue />
            <Flex direction={{ initial: 'column', xs: 'row' }} gap='8px' justify='end'>
              <EditIssueButton issueSlug={issue.slug} baseUrl={baseUrl} />
              <DeleteIssueButton issue={issue} />
            </Flex>
          </Flex>
        )}
      </CardFooter>
    </Card>
  );
};

export default IssuePage;
