'use client';

import { Link } from '@nextui-org/link';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { User } from '@nextui-org/user';
import { Issue, User as PrismaUser } from '@prisma/client';
import { Flex, Heading } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import NextLink from 'next/link';
import ChipPriority from './_components/chip-priority';
import ChipStatus from './_components/chip-status';
import { Card } from '@nextui-org/react';

const TableLatestIssues = () => {
  const searchParams = new URLSearchParams({ populate: 'true', take: '5' });
  const { data: issues, isSuccess, error, isLoading, refetch } = useIssues(searchParams);

  if (isLoading) return <p>Loading...</p>;
  else if (error) return <p>Error: {error.message}</p>;
  else if (isSuccess)
    return (
      <Card fullWidth className='p-5 bg-transparent shadow-none border'>
        <Table
          hideHeader
          removeWrapper
          aria-label='Latest issues table'
          topContent={<Heading>Latest Issues</Heading>}
          topContentPlacement='outside'
          selectionMode='none'
        >
          <TableHeader>
            <TableColumn>Issue</TableColumn>
          </TableHeader>
          <TableBody items={issues} emptyContent={'No issues found'}>
            {item => {
              const { assignee, title, slug, status, priority } = item;
              return (
                <TableRow key={item.id} className='last:border-none border-b'>
                  <TableCell>
                    <Flex direction={{ initial: 'column', sm: 'row' }} justify='between' gap='2'>
                      <Flex direction='column' align='start' gap='1'>
                        <Link href={`/issues/${slug}`} as={NextLink}>
                          {title}
                        </Link>
                        <Flex gap='2'>
                          <ChipStatus status={status} />
                          <ChipPriority priority={priority} />
                        </Flex>
                      </Flex>
                      <Flex align='start'>
                        {assignee && (
                          <User
                            name={assignee.name}
                            description={assignee.email}
                            avatarProps={{
                              size: 'sm',
                              showFallback: true,
                              alt: 'User avatar image',
                              src: assignee.image || undefined,
                              ImgComponent: Image,
                              imgProps: { width: 48, height: 48 },
                            }}
                            className='transition-transform'
                          />
                        )}
                      </Flex>
                    </Flex>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </Card>
    );
};

export default TableLatestIssues;

type IssueWithAssignee = Issue & { assignee: PrismaUser };
const useIssues = (searchParams: URLSearchParams) => {
  const isValid =
    searchParams.has('populate') || searchParams.has('take') || searchParams.has('skip');
  const query = searchParams.toString();
  return useQuery<IssueWithAssignee[]>({
    queryKey: ['latestIssues'],
    queryFn: () => fetch(`/api/issues${isValid ? `?${query}` : ''}`).then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
};
