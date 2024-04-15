import { Metadata } from 'next';
import NewIssueForm from './new-issue-form';

export const metadata: Metadata = {
  title: 'New Issue',
};

export default function NewIssuePage() {
  return (
    <div className='flex w-full justify-center'>
      <NewIssueForm />
    </div>
  );
}
