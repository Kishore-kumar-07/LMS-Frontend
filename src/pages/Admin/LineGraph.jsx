import React, { useState, useRef, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function LineGraph({ color }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect.width !== width) {
        setWidth(entries[0].contentRect.width);
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [width]);

  return (
    <div
      ref={containerRef}
      className="w-full  rounded-lg"
      style={{ maxWidth: '100%' }}
    >
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            area: true,
            fill: 'rgba(255, 255, 255, 0.5)',
            stroke: 'rgba(165, 121, 236, 1)',
            strokeWidth: 2,
            name: 'Area chart',
            color: color || '#4e79a7',
          },
        ]}
        width={width}
        height={width * 0.20} // Adjusts height based on width for responsiveness
      />
    </div>
  );
}
