'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Dispatch, SetStateAction } from 'react';

const ModalSeed = (props: ModalSeedProps) => {
  const {
    isOpenSeed,
    onOpenChangeSeed,
    numberOfSeed,
    setNumberOfSeed,
    handleCloseSeed,
    onPressSeed,
  } = props;

  return (
    <Modal
      isOpen={isOpenSeed}
      onOpenChange={onOpenChangeSeed}
      classNames={{ base: 'border border-danger' }}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>
          Are you sure you want to seed issues?
        </ModalHeader>
        <ModalBody>
          <p>This action is irreversible and will delete all data in issue database.</p>
          <Input
            type='number'
            value={numberOfSeed.toString()}
            label='Number of issues to seed'
            placeholder='Enter seed number'
            onValueChange={(value: string) => setNumberOfSeed(parseInt(value))}
          />
        </ModalBody>
        <ModalFooter>
          <Button color='default' variant='light' onPress={handleCloseSeed}>
            Close
          </Button>
          <Button color='danger' onPress={onPressSeed}>
            Seed
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalSeed;

interface ModalSeedProps {
  isOpenSeed: boolean;
  onOpenChangeSeed: () => void;
  numberOfSeed: number;
  setNumberOfSeed: Dispatch<SetStateAction<number>>;
  handleCloseSeed: () => void;
  onPressSeed: () => Promise<void>;
}
