import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';

const IssueLoadingPage = () => {
  return (
    <div>
      <Card className='bg-transparent' fullWidth shadow='none'>
        <CardHeader className='flex flex-col items-start gap-2'>
          <Skeleton className='w-[30rem] h-5 rounded-full mt-3' />

          <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
            <div className='flex gap-2'>
              <Skeleton className='w-[6rem] h-4 rounded-full mt-3' />
              <Skeleton className='w-[6rem] h-4 rounded-full mt-3' />
            </div>
            <div>
              <Skeleton className='w-[8rem] h-4 rounded-full mt-3' />
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='w-full px-5'>
          <Card shadow='sm'>
            <CardBody>
              <div className='flex flex-col gap-4 my-2'>
                {new Array(10).fill(0).map((_, i) => (
                  <Skeleton key={i} className='w-3/4 h-3 rounded-full' />
                ))}
              </div>
            </CardBody>
          </Card>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
            <Skeleton className='w-[7rem] h-5 rounded-full mt-3' />
            <Skeleton className='w-[7rem] h-5 rounded-full mt-3' />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IssueLoadingPage;
