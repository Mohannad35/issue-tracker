import { Spinner } from '@nextui-org/react';

const LoadingPage = () => {
  return (
    <div className='container flex h-max justify-center items-center'>
      <Spinner />
    </div>
  );
};

export default LoadingPage;
