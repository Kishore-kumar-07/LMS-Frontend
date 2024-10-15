import React, { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { BarChart } from "@mui/x-charts/BarChart";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useScatterChartProps } from "@mui/x-charts/internals";

// Register the necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const localizer = momentLocalizer(moment);

function EmployeePopUp({ onClose, employeeId }) {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const gaugeData = {
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#4bc0c0", "#e0e0e0"],
        borderWidth: 0,
        rotation: 270,
        circumference: 180,
        cutout: "80%",
      },
    ],
  };

  const [userData, setUserData] = useState({});
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    getUserDetails();
    getLogDetails();
  }, []);

 



  const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Gauge Chart" },
    },
  };

  const barData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Monthly Sales",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "#4bc0c0",
      },
    ],
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/getEmp`,
        {
          empId: employeeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "employeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      );
      setUserData(res.data[0]);
      console.log(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getLogDetails = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
        {
          empId: employeeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("logggggggggggggggggggggggggggggggggggg");
      setLogData(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Bar Chart" },
    },
    scales: {
      x: { title: { display: true, text: "Month" } },
      y: { title: { display: true, text: "Sales" } },
    },
  };

  const lineData = {
    labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Number of Leaves",
        data: [10, 15, 8, 12, 18, 7],
        borderColor: "#4bc0c0",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBorderColor: "#4bc0c0",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#4bc0c0",
        pointHoverBorderColor: "rgba(220, 220, 220, 1)",
        pointHoverBorderWidth: 2,
        pointRadius: 3,
        pointHitRadius: 10,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Leaves",
        },
      },
    },
  };

  const leaveLogs = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Sick Leave",
      reason: "Flu",
      status: "Approved",
    },
    {
      id: 2,
      date: "2024-02-20",
      type: "Casual Leave",
      reason: "Family Function",
      status: "Approved",
    },
    {
      id: 3,
      date: "2024-03-05",
      type: "Vacation Leave",
      reason: "Holidays",
      status: "Pending",
    },
    {
      id: 4,
      date: "2024-03-15",
      type: "Sick Leave",
      reason: "Fever",
      status: "Rejected",
    },
    {
      id: 5,
      date: "2024-04-10",
      type: "Casual Leave",
      reason: "Personal",
      status: "Approved",
    },
  ];

  return (
    <div className="w-full h-full  rounded-lg shadow-md  absolute px-10  py-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-t-lg p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">{userData.empName}'s Details</h1>
        <span
          onClick={() => {
            onClose();
          }}
          className="cursor-pointer text-2xl"
        >
          &times;
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 p-4 bg-gray-50 rounded-b-lg">
        {/* Info Section */}
        <div className="flex gap-6">
          {/* Left - Info */}
          <div className="w-1/3 bg-white rounded-lg p-4 shadow-sm">
            <table className="table-auto w-full text-left">
              <tbody>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    Designation:
                  </td>
                  <td className="text-gray-600 py-1">{userData.designation}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    Phone Number:
                  </td>
                  <td className="text-gray-600 py-1">{userData.empPhone}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    Unit:
                  </td>
                  <td className="text-gray-600 py-1">{userData.unit}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    Department:
                  </td>
                  <td className="text-gray-600 py-1">{userData.department}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    Vendor:
                  </td>
                  <td className="text-gray-600 py-1">{userData.vendor}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    Location:
                  </td>
                  <td className="text-gray-600 py-1">{userData.location}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* {employeeId}oeringoeirvnotienworigbntriobnrwoi */}
          {/* Right - Line Chart */}
          <div className="w-2/3 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-start">
              Yearly Leave Statistics
            </h2>
            <div className="h-40">
              {/* <Line data={lineData} options={lineOptions} /> */}
              <div className="w-full h-[100%]">
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: [
                        "JAN",
                        "FEB",
                        "MAR",
                        "APR",
                        "MAY",
                        "JUN",
                        "JUL",
                        "AUG",
                        "SEP",
                        "OCT",
                        "NOV",
                        "DEC  ",
                      ],
                    },
                  ]}
                  series={[
                    { data: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
                    { data: [1, 6, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4] },
                    // { data: [2, 5, 6] },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex gap-6">
          {/* Left - Doughnut and Bar Charts */}
          <div className="w-1/3 flex flex-col gap-4 justify-center items-center ">
            {/* Doughnut Chart */}
            {/* <div className="bg-white rounded-lg shadow-sm p-4 h-36">
              <Doughnut data={gaugeData} options={gaugeOptions} />
            </div> */}
            <Calendar
        localizer={localizer}
       
        startAccessor="start"
        endAccessor="end"
        style={{ height: 400, width: 400 }}
        defaultView="month"
        views="month"
      />

            {/* Bar Chart */}
            {/* <div className="bg-white rounded-lg shadow-sm p-4 h-60">
              <Bar data={barData} options={barOptions} />
            </div> */}
          </div>

          {/* Right - Leave Logs */}
          <div className="w-2/3 bg-white rounded-lg shadow-sm p-4 overflow-y-auto max-h-96">
            <h2 className="text-lg font-semibold text-gray-700 mb-2 text-start">
              Leave Logs
            </h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">
                    Applied Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">
                    Leave Type
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">
                    From Date
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600">To Date</th>
                  <th className="px-4 py-2 text-left text-gray-600">Reason</th>
                  <th className="px-4 py-2 text-left text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((log, index) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{log.today}</td>
                    <td className="px-4 py-2 border-b">{log.leaveType}</td>
                    <td className="px-4 py-2 border-b whitespace-nowrap overflow-hidden text-ellipsis">
                      {log.from.date}
                    </td>
                    <td className="px-4 py-2 border-b">{log.to.date}</td>
                    <td className="px-4 py-2 border-b">{log.reason}</td>
                    <td className="px-4 py-2 border-b">{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeePopUp;
