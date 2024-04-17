'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Autocomplete, AutocompleteItem, Avatar, User as UserComponent } from '@nextui-org/react';
import { Issue, User } from '@prisma/client';
import { Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Key, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AssigningIssue = ({ issue: { slug, assigneeId } }: { issue: Issue }) => {
  let { theme, systemTheme } = useTheme();
  theme = theme === 'system' ? systemTheme : (theme as 'dark' | 'light' | undefined);
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
    staleTime: 1000 * 60, // 1 minute
    retry: 3,
  });
  const [user, setUser] = useState(users?.find(user => user.id === assigneeId));
  useEffect(() => {
    setUser(users?.find(user => user.id === assigneeId));
  }, [assigneeId, users]);

  const [assignLoading, setAssignLoading] = useState(false);
  if (isLoading) return <Skeleton className='w-[21.5rem] h-[2.5rem] rounded-medium' />;
  else if (error) return null;

  const onSelectionChange = async (userId: Key) => {
    setAssignLoading(true);
    await fetch('/api/issues/' + slug, {
      method: 'PATCH',
      cache: 'no-store',
      body: JSON.stringify({ assigneeId: userId }),
    })
      .then(res => res.json())
      .catch(() => {
        toast('Changes could not be saved.', { type: 'error', theme });
      });
    setUser(users?.find(user => user.id === userId));
    setAssignLoading(false);
  };

  return (
    <Flex direction={{ initial: 'column', md: 'row' }} gap='1rem'>
      <Autocomplete
        isLoading={assignLoading}
        isDisabled={assignLoading}
        defaultItems={users}
        variant='faded'
        label='Assigned to'
        placeholder='Select a user'
        labelPlacement='outside-left'
        className='max-w-md'
        onSelectionChange={onSelectionChange}
        defaultSelectedKey={assigneeId || undefined}
      >
        {user => (
          <AutocompleteItem key={user.id} textValue={user.name || ''}>
            <UserComponent
              name={user.name}
              avatarProps={{
                size: 'sm',
                showFallback: true,
                alt: 'User avatar image',
                src: user.image || undefined,
                ImgComponent: Image,
                imgProps: { width: 48, height: 48 },
              }}
              className='transition-transform'
              description={user.email}
            />
          </AutocompleteItem>
        )}
      </Autocomplete>
      {user && (
        <UserComponent
          name={user?.name}
          avatarProps={{
            size: 'sm',
            showFallback: true,
            alt: 'User avatar image',
            src: user?.image || undefined,
            ImgComponent: Image,
            imgProps: { width: 48, height: 48 },
          }}
          className='transition-transform justify-start'
          description={user?.email}
        />
      )}
    </Flex>
  );
};

export default AssigningIssue;
