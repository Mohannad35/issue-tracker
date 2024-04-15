import React from 'react';
import DashButton from './dashButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const DashboardPage = () => {
  return (
    <div>
      <DashButton />
    </div>
  );
};

export default DashboardPage;
