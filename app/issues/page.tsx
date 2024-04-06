import NewIssueButton from './components/NewIssueButton';
import SeedIssueButton from './components/SeedIssueButton';
import IssuesDataTable from './issues-data-table';

const IssuesPage = () => {
  return (
    <div className='container flex flex-col w-full space-y-5'>
      <div className='flex justify-between'>
        <NewIssueButton />
        <SeedIssueButton />
      </div>
      <IssuesDataTable />
    </div>
  );
};

export default IssuesPage;
