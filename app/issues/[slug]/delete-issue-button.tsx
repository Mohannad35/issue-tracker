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
import { Trash2Icon } from 'lucide-react';

const DeleteIssueButton = ({ issueTitle }: { issueTitle: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color='danger' variant='solid' endContent={<Trash2Icon size={20} />}>
        <span className='text-lg'>Delete</span>
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Delete {issueTitle}?</ModalHeader>
              <ModalBody>
                <p>This Action can&apos;t be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button color='default' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='danger' onPress={onClose}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteIssueButton;
