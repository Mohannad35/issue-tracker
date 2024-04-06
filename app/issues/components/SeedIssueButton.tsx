'use client';

import { seedIssues } from '@/lib/seedIssues';
import { Button } from '@nextui-org/react';
import { DatabaseBackup } from 'lucide-react';
import { useState } from 'react';

const SeedIssueButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onPressButton = async () => {
    setIsLoading(true);
    await seedIssues(window.location.origin + '/api/issues');
    setIsLoading(false);
  };

  return (
    <Button
      color='default'
      variant='solid'
      startContent={<DatabaseBackup />}
      isLoading={isLoading}
      onPress={onPressButton}
    >
      Seed Issues
    </Button>
  );
};

export default SeedIssueButton;
