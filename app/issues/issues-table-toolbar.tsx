'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { seedIssues } from '@/lib/seedIssues';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { DatabaseBackupIcon, PlusCircleIcon, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getIssues, Issue } from './utils';

const IssuesTableToolbar = ({
  isLoadingRefresh,
  setIsLoadingRefresh,
  setIssues,
}: {
  isLoadingRefresh: boolean;
  setIsLoadingRefresh: Dispatch<SetStateAction<boolean>>;
  setIssues: Dispatch<SetStateAction<Issue[]>>;
}) => {
  const router = useRouter();
  const [numberOfSeed, setNumberOfSeed] = useState(10);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingSeed, setIsLoadingSeed] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const refreshData = async () => {
    const issues = await getIssues();
    setIssues(issues);
  };

  const onClickRefresh = async () => {
    setIsLoadingRefresh(true);
    await refreshData();
    setIsLoadingRefresh(false);
  };

  const onCloseSeed = () => {
    onClose();
    setNumberOfSeed(10);
  };
  const onPressSeed = async () => {
    if (typeof numberOfSeed !== 'number' || isNaN(numberOfSeed) || numberOfSeed < 1) return;
    onClose();
    setIsLoadingSeed(true);
    await seedIssues(window.location.origin + '/api/issues', numberOfSeed);
    setIsLoadingSeed(false);
    setNumberOfSeed(10);
  };

  const onPressNew = () => {
    setIsLoadingNew(true);
    router.push('/issues/new');
  };

  return (
    <div className='flex flex-col xs:flex-row xs:space-y-0 justify-between space-y-2'>
      <Button
        color='default'
        variant='solid'
        startContent={<PlusCircleIcon />}
        isLoading={isLoadingNew}
        onPress={onPressNew}
        className='max-w-40'
      >
        New Issue
      </Button>

      <div className='flex gap-2'>
        <Button
          isIconOnly
          isLoading={isLoadingRefresh}
          spinner={<RefreshCw className='h-6 w-6 animate-spin' />}
          onClick={onClickRefresh}
          variant='bordered'
          className='ml-auto'
        >
          <RefreshCw />
          <span className='sr-only'>Refresh table data</span>
        </Button>

        <Button
          color='default'
          variant='solid'
          startContent={<DatabaseBackupIcon />}
          isLoading={isLoadingSeed}
          onPress={onOpen}
        >
          Seed Issues
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          classNames={{ base: 'border border-danger' }}
        >
          <ModalContent>
            <ModalHeader className='flex flex-col gap-1'>
              Are you sure you want to seed issues?
            </ModalHeader>
            <ModalBody>
              <p>This action is irreversible and will delete all data in issue database.</p>
              <Input
                // className='border border-destructive'
                type='number'
                value={numberOfSeed.toString()}
                label='Number of issues to seed'
                placeholder='Enter seed number'
                onValueChange={(value: string) => setNumberOfSeed(parseInt(value))}
              />
            </ModalBody>
            <ModalFooter>
              <Button color='default' variant='light' onPress={onCloseSeed}>
                Close
              </Button>
              <Button color='danger' onPress={onPressSeed}>
                Seed
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default IssuesTableToolbar;
