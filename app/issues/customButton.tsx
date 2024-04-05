'use client';

import { Button } from '@nextui-org/react';
import { LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CustomButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onPressButton = () => {
    setIsLoading(true);
    router.push('/issues/new');

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 3000);
  };

  return (
    <Button
      color='primary'
      variant='solid'
      startContent={<LayoutDashboard />}
      isLoading={isLoading}
      // spinnerPlacement='end'
      onPress={onPressButton}
    >
      New Issue
    </Button>
  );
};

export default CustomButton;
