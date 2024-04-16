'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Autocomplete, AutocompleteItem, User as UserComponent } from '@nextui-org/react';
import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

const AssigningIssue = () => {
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

  if (isLoading) return <Skeleton className='w-[21.5rem] h-[2.5rem] rounded-medium' />;
  else if (error) return null;

  return (
    <Autocomplete
      defaultItems={users}
      variant='bordered'
      label='Assigned to'
      placeholder='Select a user'
      labelPlacement='outside-left'
      className='max-w-md'
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
  );
};

export default AssigningIssue;
