import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { max } from 'date-fns';

export default function LineGraph({ color }) {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [leaveCounts, setLeaveCounts] = useState(Array(12).fill(0));
  const [filterType, setFilterType] = useState("All Types");
  const [leaveData, setLeaveData] = useState([]); // Store all leave data here

  useEffect(() => {
    getLogDetails(); // Fetch all leave data once on component mount
  }, []);

  const getLogDetails = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
        {
          empId: empId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLeaveData(res.data); // Store full leave data
      filterLeaveDataByMonth(res.data, filterType); // Apply initial filter
    } catch (error) {
      console.log(error);
    }
  };

  const filterLeaveDataByMonth = (logs, selectedFilter) => {
    const leaveCountPerMonth = Array(12).fill(0);

    // Filter the logs based on the selected filter type
    const filteredLogs = selectedFilter === "All Types" 
      ? logs 
      : logs.filter(log => log.role === selectedFilter);

    filteredLogs.forEach((log) => {
      const fromDate = moment(log.from.date, "DD/MM/YYYY");
      const monthIndex = fromDate.month();

      if (log.status === "Approved") {
        leaveCountPerMonth[monthIndex] += log.leaveDays;
      }
    });

    setLeaveCounts(leaveCountPerMonth); // Update the chart data
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilterType(newFilter); // Update the selected filter
    filterLeaveDataByMonth(leaveData, newFilter); // Re-filter the data based on the new filter
  };

  const data = {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    datasets: [
      {
        label: "Leave Counts",
        data: leaveCounts,
        fill: true,
        backgroundColor: "rgb(222, 124, 125)",
        borderColor: "rgb(222, 124, 125)",
        borderWidth: 2,
        borderJoinStyle: 'round',
        tension: 0.3
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
        
      },
      y: {
        title: {
          display: true,
          text: 'Leave Counts',
        },
        beginAtZero: true,
        max : leaveData.length
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
      <div className='p-1 w-[20%] flex justify-center items-center'>
      <select value={filterType} onChange={handleFilterChange} className='border p-1 rounded-lg border-gray border-2 w-[50%]'>
        <option value="All Types">All Types</option>
        <option value="3P">3P</option>
        <option value="GVR">GVR</option>
      </select>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
