'use client';

import { Button } from '@nextui-org/react';
import { SquarePenIcon, Trash2Icon } from 'lucide-react';

export default function NewIssueToolBar() {
  return (
    <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
      <div>
        <Button color='default' variant='solid' endContent={<SquarePenIcon size={20} />}>
          <span className='text-lg'>Edit</span>
        </Button>
      </div>
      <div>
        <Button color='danger' variant='solid' endContent={<Trash2Icon size={20} />}>
          <span className='text-lg'>Delete</span>
        </Button>
      </div>
    </div>
  );
}
