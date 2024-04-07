import NewIssueButton from './components/NewIssueButton';
import SeedIssueButton from './components/SeedIssueButton';
import IssuesDataTable from './components/issues-data-table';

const IssuesPage = () => {
  return (
    <div className='container flex flex-col w-full space-y-5 pb-20'>
      <IssuesDataTable />
    </div>
  );
};

export default IssuesPage;
