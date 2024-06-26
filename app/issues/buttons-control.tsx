'use client';

import { Button } from '@nextui-org/button';
import { Text } from '@radix-ui/themes';
import { DatabaseBackupIcon, PlusCircleIcon, RefreshCw } from 'lucide-react';

const ControlButtons = (props: ControlButtonsProps) => {
  const {
    status,
    isLoadingRefresh,
    isLoadingNew,
    isLoadingSeed,
    onClickRefresh,
    onPressNew,
    onOpenSeed,
  } = props;

  return (
    <>
      <Button
        isIconOnly
        isLoading={isLoadingRefresh}
        spinner={<RefreshCw size={20} className='animate-spin' />}
        onClick={onClickRefresh}
        color='default'
        variant='light'
        size='md'
      >
        <RefreshCw size={20} />
        <Text className='sr-only'>Refresh table data</Text>
      </Button>

      {status === 'authenticated' && (
        <>
          <Button
            color='default'
            variant='ghost'
            startContent={<PlusCircleIcon size={20} />}
            isLoading={isLoadingNew}
            onPress={onPressNew}
            className='max-w-40'
            size='md'
          >
            New Issue
          </Button>

          <Button
            color='default'
            variant='ghost'
            startContent={<DatabaseBackupIcon size={20} />}
            isLoading={isLoadingSeed}
            onPress={onOpenSeed}
            size='md'
          >
            Seed Issues
          </Button>
        </>
      )}
    </>
  );
};

export default ControlButtons;

interface ControlButtonsProps {
  status: 'authenticated' | 'loading' | 'unauthenticated';
  isLoadingRefresh: boolean;
  isLoadingNew: boolean;
  isLoadingSeed: boolean;
  onClickRefresh: () => Promise<void>;
  onPressNew: () => void;
  onOpenSeed: () => void;
}
