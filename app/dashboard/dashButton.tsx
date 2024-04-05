'use client';

import { Button } from '@nextui-org/react';
import { LayoutDashboard } from 'lucide-react';
import React, { useState } from 'react';

const DashButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onPressButton = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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
      Dashboard Page
    </Button>
  );
};

export default DashButton;
