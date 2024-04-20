import { Flex, Heading } from '@radix-ui/themes';
import { Metadata } from 'next';

export default async function Home() {
  return (
    <Flex gap='5' direction='column'>
      <Heading>Issue Tracker Home Page</Heading>
    </Flex>
  );
}

export const metadata: Metadata = {
  title: 'Issue Tracker',
  description: 'Issue Tracker application built with Next.js and Prisma',
};
