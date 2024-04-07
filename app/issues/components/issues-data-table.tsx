'use client';

import { useEffect, useState } from 'react';
import { columns } from './shadcn/coloumns';
import { DataTable } from './shadcn/data-table';
import { Issue } from './shadcn/issue-schema';
import TableNextUi from './data-table';
import { useRouter } from 'next/navigation';
import { seedIssues } from '@/lib/seedIssues';
import { DatabaseBackupIcon, PlusCircleIcon, RefreshCw } from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { cn } from '@/lib/utils';

export async function getIssues() {
  // const headersList = headers();
  // const baseUrl = `${headersList.get('x-forwarded-proto')}://${headersList.get('host')}`;
  const issues: Issue[] = await (await fetch('/api/issues', { method: 'GET' })).json();
  return issues;
}

const IssuesDataTable = () => {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [numberOfSeed, setNumberOfSeed] = useState(10);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingSeed, setIsLoadingSeed] = useState(false);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    setLoading(true);
    getIssues().then(issues => {
      setIssues(issues);
      setLoading(false);
    });
  }, []);

  const refreshData = async () => {
    setLoading(true);
    const issues = await getIssues();
    setIssues(issues);
    setLoading(false);
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
    <div className='flex flex-col space-y-5'>
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

      <TableNextUi data={issues} loading={loading} />
      {/* <DataTable data={issues} columns={columns} refreshData={refreshData} loading={loading} /> */}
    </div>
  );
};

export default IssuesDataTable;
