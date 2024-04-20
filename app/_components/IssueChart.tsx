'use client';

import { Card } from '@nextui-org/react';
import { Status } from '@prisma/client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const IssueChart = ({ statusCount }: IssueSummaryProps) => {
  const data = [
    { label: 'Open Issues', count: statusCount.OPEN },
    { label: 'In-progress Issues', count: statusCount.IN_PROGRESS },
    { label: 'Closed Issues', count: statusCount.CLOSED },
    { label: 'Cancelled Issues', count: statusCount.CANCELLED },
  ];

  return (
    <Card className='p-3 bg-transparent shadow-none border h-full w-full'>
      <ResponsiveContainer width='100%' minHeight={300} height='100%'>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <XAxis dataKey='label' />
          <YAxis />
          <Bar dataKey='count' maxBarSize={30} style={{ fill: 'var(--accent-9)' }} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default IssueChart;

interface IssueSummaryProps {
  statusCount: {
    [key in Status]: number;
  };
}
