import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import {jwtDecode} from 'jwt-decode';
import { Calendar, momentLocalizer } from 'react-big-calendar';

export default function LineGraph({ color }) {
  const localizer = momentLocalizer(moment);
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [leaveCounts, setLeaveCounts] = useState(Array(12).fill(0));

  useEffect(() => {
    getLogDetails();
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

      filterLeaveDataByMonth(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterLeaveDataByMonth = (logs) => {
    const leaveCountPerMonth = Array(12).fill(0);

    logs.forEach((log) => {
      const fromDate = moment(log.from.date, "DD/MM/YYYY");
      const monthIndex = fromDate.month();

      if (log.status === "Approved" ) {
        leaveCountPerMonth[monthIndex] += log.leaveDays;
      }
    });
    console.log(leaveCountPerMonth)
    setLeaveCounts(leaveCountPerMonth);
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
        borderJoinStyle : 'round',
        tension : 0.3
        
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Makes the chart responsive
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
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '200px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
