import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

export default function LineGraph({ department_ , changeInDept , gender , changeInGender , unit , changeInUnit , subDept , changeInSubDept  }) {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [leaveCounts, setLeaveCounts] = useState(Array(12).fill(0));
  const [filterType, setFilterType] = useState("All Types");
  const [filterYear, setFilterYear] = useState("2024");
  const [leaveData, setLeaveData] = useState([]);
  const [overAll , setOverAll] = useState(0);
  const [empAll, setEmpAll] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    getLogDetails(); 
    getAllEmployee();
  }, [changeInDept , changeInUnit , changeInGender , changeInSubDept]);

  const newDate = new Date().getFullYear();
  // console.log(newDate);

  const getAllEmployee = async () => {
    try {
      const allEmp = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/getAll`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("in admin home ", allEmp);
      setEmpAll(allEmp.data);
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
      console.log("error");
    }
  };

  const getLogDetails = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
        { empId },
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

      // Apply filters after fetching the leave data
      filterLeaveDataByMonth(res.data, filterType, department_);
      filterLeaveDataByMonth_Year(res.data, filterYear, department_);
    } catch (error) {
      console.log(error);
    }
  };

  const filterLeaveDataByMonth = (logs, selectedFilter, department_) => {
    const leaveCountPerMonth = Array(12).fill(0);

    const filteredLogs = selectedFilter === "All Types"
      ? logs
      : logs.filter(log => log.role === selectedFilter);

    // Filter by department
    filteredLogs.forEach((log) => {
      const employee = empAll.find(emp => emp.empId === log.empId);
      if (
        (department_ === "All Departments" || employee.department === department_) &&
        (unit === "All Units" || employee.unit === unit) &&
        (gender === "All Gender" || employee.gender === gender) &&
        (subDept === "All Sub Departments" || employee.subDepartment === subDept) &&
        log.status === "Approved"
      ) {
        const fromDate = moment(log.from.date, "DD/MM/YYYY");
        const monthIndex = fromDate.month();
        leaveCountPerMonth[monthIndex] += log.leaveDays;
      }
    });
    // console.log(leaveCountPerMonth)

    setLeaveCounts(leaveCountPerMonth);
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilterType(newFilter);
    filterLeaveDataByMonth(leaveData, newFilter, department_);
  };

  const filterLeaveDataByMonth_Year = (logs, selectedYear, department_) => {
    const leaveCountPerMonth = Array(12).fill(0);

    const filteredLogs = selectedYear === "2024"
      ? logs
      : logs.filter(log => new Date(log.from.date).getFullYear() === parseInt(selectedYear) && log.role === filterType);

    // Filter by department
    filteredLogs.forEach((log) => {
      const employee = empAll.find(emp => emp.empId === log.empId);
      if (
        (department_ === "All Departments" || employee.department === department_) &&
        (unit === "All Units" || employee.unit === unit) &&
        (gender === "All Gender" || employee.gender === gender) &&
        (subDept === "All Sub Departments" || employee.subDepartment === subDept) &&
        log.status === "Approved"
      ) {
        const fromDate = moment(log.from.date, "DD/MM/YYYY");
        const monthIndex = fromDate.month();
        leaveCountPerMonth[monthIndex] += log.leaveDays;
      }
    });
    // console.log(leaveCountPerMonth)
    setLeaveCounts(leaveCountPerMonth);
  };

  const handleFilterYear = (event) => {
    const newFilter = event.target.value;
    setFilterYear(newFilter);
    filterLeaveDataByMonth_Year(leaveData, newFilter, department_);
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
      {
        label: "Threshold (y = 5)",
        data: Array(12).fill(5), // Creates a horizontal line at y = 5
        borderColor: "rgb(0, 0, 0)", // Color of the line
        borderWidth: 1, // Thickness of the line
        borderDash: [5, 5], // Dashed line style (optional)
        pointRadius: 0, // Remove points for this dataset
        fill: false, // No fill under the line
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
        max: overAll + 1,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '210px' }}>
      <div className='p-1  flex justify-between items-center gap-4 w-full pl-5 pr-5'>
        <div className='w-[25%] flex gap-5'>
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
        <div className='pr-40 font-semibold text-lg'>
          Annual Leaves
        </div>
        <div>
          
        </div>
        
      </div>
      
      <div style={{ width: '100%', height: '180px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
