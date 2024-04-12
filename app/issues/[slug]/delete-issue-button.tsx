'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { Issue } from '@prisma/client';
import { Trash2Icon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';

const DeleteIssueButton = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  let { theme, systemTheme } = useTheme();
  const toastId = useRef<Id | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleDelete = async () => {
    toastId.current = toast('Deleting issue...', {
      autoClose: false,
      type: 'default',
      isLoading: true,
      theme: theme === 'system' ? systemTheme : (theme as 'dark' | 'light' | undefined),
    });
    const response = await fetch(`/api/issues/${issue.slug}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      const { title }: Issue = await response.json();
      onClose();
      toastId.current &&
        toast.update(toastId.current, {
          isLoading: false,
          type: 'success',
          render: `${title} deleted`,
          autoClose: 3000,
          progress: 0,
        });
      // Redirect to the issues page.
      router.push('/issues');
    } else if (response.status >= 400 && response.status < 500) {
      const { message } = await response.json();
      onClose();
      toastId.current &&
        toast.update(toastId.current, {
          isLoading: false,
          type: 'error',
          render: message || 'An unexpected error occurred. Please try again later.',
          autoClose: 3000,
          progress: 0,
        });
      setTimeout(() => window.location.reload(), 3000);
    } else if (response.status >= 500) {
      onClose();
      toastId.current &&
        toast.update(toastId.current, {
          type: 'error',
          render: 'An unexpected error occurred. Please try again later.',
          autoClose: 3000,
        });
      setTimeout(() => window.location.reload(), 3000);
    }
  };

  return (
    <>
      <Button onPress={onOpen} color='danger' variant='solid' endContent={<Trash2Icon size={20} />}>
        <span className='text-lg'>Delete</span>
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Delete {issue.title}?</ModalHeader>
          <ModalBody>
            <p>This Action can&apos;t be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button color='default' variant='light' onPress={onClose}>
              Close
            </Button>
            <Button color='danger' onPress={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteIssueButton;
