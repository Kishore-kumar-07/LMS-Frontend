import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function LineGraph({color}) {

  const emptySeries = {
  series: [],
  margin: { top: 10, right: 10, left: 25, bottom: 25 },
  height: 150,
};

  return (
    <div className = "w-[50%]">
      <LineChart
      
      xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
      series={[
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5],
          area : true,
          fill: 'rgba(255, 255, 255, 0.5)',
          stroke: 'rgba(165, 121, 236, 1)',
          strokeWidth: 2,
          name: 'Area chart',
          color: '#4e79a7'
          
        },
      ]}
      height={200}
    />
    </div>
  );
}
