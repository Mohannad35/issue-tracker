'use client';

import { Button } from '@nextui-org/react';

const SubmitButton = ({
  isLoading,
  label,
  Icon,
}: {
  isLoading?: boolean | undefined;
  label: string;
  Icon?: JSX.Element | undefined;
}) => {
  return (
    <Button
      type='submit'
      color='primary'
      variant='solid'
      startContent={Icon}
      isLoading={isLoading}
      spinnerPlacement='end'
      className='text-base font-semibold max-sm:w-full'
    >
      {label}
    </Button>
  );
};

export default SubmitButton;
