'use client';

import { Button } from '@nextui-org/react';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const NewIssueButton = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onPressButton = () => {
    setIsLoading(true);
    router.push('/issues/new');
  };

  return (
    <Button
      color='default'
      variant='solid'
      startContent={<PlusCircle />}
      isLoading={isLoading}
      onPress={onPressButton}
    >
      New Issue
    </Button>
  );
};

export default NewIssueButton;
