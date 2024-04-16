'use client';

import { Autocomplete, AutocompleteItem, User as UserComponent } from '@nextui-org/react';
import { User } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AssigningIssue = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function getUsers() {
      const res: User[] = await (await fetch('/api/users')).json();
      setUsers(res);
    }
    getUsers();
  }, []);

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
