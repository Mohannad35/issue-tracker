import { Button } from '@nextui-org/button';
import { SquarePenIcon } from 'lucide-react';
import Link from 'next/link';

const EditIssueButton = ({ issueSlug, baseUrl }: { issueSlug: string; baseUrl: string }) => {
  return (
    <Button
      as={Link}
      href={`${baseUrl}/issues/${issueSlug}/edit`}
      color='default'
      variant='solid'
      endContent={<SquarePenIcon size={20} />}
    >
      <span className='text-lg'>Edit</span>
    </Button>
  );
};

export default EditIssueButton;
