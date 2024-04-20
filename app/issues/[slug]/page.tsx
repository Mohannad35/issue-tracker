import { auth } from '@/auth';
import prisma from '@/prisma/client';
import { Card, CardFooter, Divider } from '@nextui-org/react';
import { Flex } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import AssigningIssue from './AssigningIssue';
import DeleteIssueButton from './delete-issue-button';
import EditIssueButton from './edit-issue-button';
import IssueDetails from './issue-details';
import { cache } from 'react';

const IssuePage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const issue = await fetchIssue(slug);
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
            <AssigningIssue issue={issue} />
            <Flex direction={{ initial: 'column', xs: 'row' }} gap='8px' justify='end'>
              <EditIssueButton issueSlug={issue.slug} />
              <DeleteIssueButton issue={issue} />
            </Flex>
          </Flex>
        )}
      </CardFooter>
    </Card>
  );
};

export default IssuePage;

const fetchIssue = cache((issueSlug: string) =>
  prisma.issue.findUnique({ where: { slug: issueSlug } })
);

export async function generateMetadata({ params: { slug } }: { params: { slug: string } }) {
  const issue = await fetchIssue(slug);

  return {
    title: issue?.title,
    description: `Details of issue: ${issue?.title}`,
  };
}
