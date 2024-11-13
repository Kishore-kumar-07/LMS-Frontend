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
  const [filterYear, setFilterYear] = useState("2024");
  const [leaveData, setLeaveData] = useState([]); 
  const [overAll , setOverAll] = useState(0);

  useEffect(() => {
    getLogDetails(); 
  }, []);

  const newDate = new Date().getFullYear();
  console.log(newDate)

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

      setLeaveData(res.data); 
      const data = res.data;
      const totalLeaveDays = data.reduce((sum, row) => sum + row.leaveDays, 0);
      setOverAll(totalLeaveDays);
      
      filterLeaveDataByMonth(res.data, filterType);
      filterLeaveDataByMonth_Year(res.data, filterYear);
    } catch (error) {
      console.log(error);
    }
  };

  const filterLeaveDataByMonth = (logs, selectedFilter) => {
    const leaveCountPerMonth = Array(12).fill(0);

   
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

    setLeaveCounts(leaveCountPerMonth); 
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilterType(newFilter); 
    filterLeaveDataByMonth(leaveData, newFilter);
  };

  const filterLeaveDataByMonth_Year = (logs, selectedYear) => {
    const leaveCountPerMonth = Array(12).fill(0);

    // Filter the logs based on the selected filter type
    const filteredLogs = selectedYear === "2024" 
      ? logs 
      : logs.filter(log => new Date(log.from.date).getFullYear() === parseInt(selectedYear) && log.role === filterType);

    console.log(filteredLogs);
    filteredLogs.forEach((log) => {
      const fromDate = moment(log.from.date, "DD/MM/YYYY");
      const monthIndex = fromDate.month();

      if (log.status === "Approved") {
        leaveCountPerMonth[monthIndex] += log.leaveDays;
        
      }
    });
    console.log(leaveCountPerMonth)
    setLeaveCounts(leaveCountPerMonth); 
  }

  const handleFilterYear = (event) => {
    const newFilter = event.target.value;
    setFilterYear(newFilter); 
    filterLeaveDataByMonth_Year(leaveData, newFilter); 
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
        max : overAll+1
      },
    },
  };

  return (
    <div style={{  width: '100%', height: '210px' }}>
      <div className='p-1 w-[20%] flex justify-center items-center gap-4'>
      <select value={filterType} onChange={handleFilterChange} className='border p-1 rounded-lg border-gray border-2 w-[50%]'>
        <option value="All Types">All Types</option>
        <option value="3P">3P</option>
        <option value="GVR">GVR</option>
      </select>
      <select value={filterYear} onChange={handleFilterYear} className='border p-1 rounded-lg border-gray border-2 w-[50%]'>
        <option value={newDate}>{newDate}</option>
        <option value={newDate - 1}>{newDate - 1}</option>
        <option value={newDate - 2}>{newDate - 2}</option>
      </select>
      </div>
      <div style={{  width: '100%', height: '180px' }}>
      <Line data={data} options={options} />
      </div>
    </div>
  );
}
