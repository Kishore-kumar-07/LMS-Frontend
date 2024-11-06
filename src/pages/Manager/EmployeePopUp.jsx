import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
// import useNavigate
import { Doughnut } from "react-chartjs-2";
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
import { useNavigate } from "react-router-dom";
import { SIZE } from "rsuite/esm/internals/constants";

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
  const navigation = useNavigate();
  const [events, setEvents] = useState([]);
  const [gaugeData_, setGaugeData] = useState([]);
  const [leaveCounts, setLeaveCounts] = useState(Array(12).fill(0));
  const [lopCounts, setLopCounts] = useState(Array(12).fill(0));

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [userData, setUserData] = useState({});
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    getUserDetails();
    getLogDetails();
    getGaugeDetails();
  }, []);


  const getGaugeDetails = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/gauge`,
        {
          empId : empId,
          employeeId: employeeId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data)
      setGaugeData(res.data)
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
      console.log(error);
    }
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
      setUserData(res.data[0]);
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
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
      setLogData(res.data.reverse());
      console.log(res.data);
      filterLeaveDataByMonth(res.data); // Filter and calculate leave data by month
    } catch (error) {
      console.log(error);
    }
  };

  const gaugeData = {
    datasets: [
      {
        data: [gaugeData_.emp , gaugeData_.all - gaugeData_.emp],
        backgroundColor: ["#125B9A", "#e0e0e0"],
        borderWidth: 0,
        rotation: 270,
        circumference: 180,
        cutout: "80%",
      },
    ],
  };

  const gaugeOptions = {
    
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Leave Percentage" },
      
      
    },
  };


  // Function to filter and calculate leave and LOP counts per month
  const filterLeaveDataByMonth = (logs) => {
    const leaveCountPerMonth = Array(12).fill(0);
    const lopCountPerMonth = Array(12).fill(0);

    logs.forEach((log) => {
      const fromDate = moment(log.from.date, "DD/MM/YYYY");
      const monthIndex = fromDate.month(); // 0 for January, 11 for December

      console.log(monthIndex);
      if (log.LOP === 0 && log.status === "Approved") {
        leaveCountPerMonth[monthIndex] += log.numberOfDays;
      } else if (log.LOP !== 0 && log.status === "Approved") {
        lopCountPerMonth[monthIndex] += log.LOP;
      }
      console.log(leaveCountPerMonth);
    });

    setLeaveCounts(leaveCountPerMonth);
    setLopCounts(lopCountPerMonth);
  };

  useEffect(() => {
    setTheEvents();
  }, [logData]);

  const setTheEvents = () => {
    setEvents(
      logData
        .map((event) => {
          const fromDate = moment(event.from.date, "DD/MM/YYYY").isValid()
            ? moment(event.from.date, "DD/MM/YYYY")
            : null;
          const toDate = moment(event.to.date, "DD/MM/YYYY").isValid()
            ? moment(event.to.date, "DD/MM/YYYY")
            : null;

          if (fromDate && toDate && event.status === "Approved") {
            const dateArray = [];
            let currentDate = fromDate.clone();
            while (currentDate.isSameOrBefore(toDate)) {
              dateArray.push({
                start: currentDate.toDate(),
                end: currentDate.toDate(),
                title: "",
                id: event._id,
              });
              currentDate.add(1, "days");
            }

            return dateArray;
          } else {
            console.error(
              `Invalid dates: fromDate = ${event.from.date}, toDate = ${event.to.date}`
            );
            return null;
          }
        })
        .flat()
        .filter((event) => event !== null)
    );
  };

  // Function to reverse the date
  const reverseDate = (dateStr) => {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Function to get the color based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "orange";
      case "Denied":
        return "red";
      default:
        return "gray"; // Default color for unknown status
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        width: "20px",
        backgroundColor: "green",
        borderRadius: "100%",
        border: "none",
        color: "transparent",
        padding: "10px",
      },
    };
  };

  return (
    <div className="h-full rounded-lg shadow-md absolute px-4 sm:px-10 py-2 flex flex-col w-full">
      {/* Header */}
      <div className="w-full bg-gray-600 text-white rounded-t-lg p-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">{userData.empName}'s Details</h1>
        <span
          onClick={() => {
            onClose();
          }}
          className="cursor-pointer text-3xl text-white font-semibold"
        >
          &times;
        </span>
      </div>
  
      <div className="flex flex-col gap-4 sm:gap-6 p-4 bg-gray-50 rounded-b-lg w-full">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Adjust width here */}
          <div className="flex-1 max-w-[400px] bg-white rounded-lg p-4 shadow-sm">
            <table className="table-auto w-full text-left">
              <tbody>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">Designation:</td>
                  <td className="text-gray-600 py-1">{userData.role}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">Phone Number:</td>
                  <td className="text-gray-600 py-1">{userData.empPhone}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">Unit:</td>
                  <td className="text-gray-600 py-1">{userData.unit}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">Department:</td>
                  <td className="text-gray-600 py-1">{userData.department}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">Vendor:</td>
                  <td className="text-gray-600 py-1">{userData.vendor}</td>
                </tr>
                <tr>
                  <td className="font-bold text-gray-700 py-1 pr-4 whitespace-nowrap overflow-hidden text-ellipsis">Location:</td>
                  <td className="text-gray-600 font-semibold py-1">{userData.location}</td>
                </tr>
              </tbody>
            </table>
          </div>
  
          {/* Right - Yearly Leave Statistics */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Yearly Leave Statistics</h2>
            <div className="flex h-40 w-full ">
              <div className="flex-1 flex justify-center items-center">
                <BarChart
                  xAxis={[{ scaleType: "band", data: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] }]}
                  series={[{ label: "Leave", data: leaveCounts }, { label: "LOP", data: lopCounts }]}
                />
              </div>
              <div className="w-1/4 h-3/4 flex justify-center items-center">
                <Doughnut data={gaugeData} options={gaugeOptions}/>
              </div>
              <p>{gaugeData_.emp} of {gaugeData_.all}<br></br> Total Leaves</p>
            </div>
          </div>
        </div>
  
        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 ">
          
          <div className="flex-1 max-w-[400px] flex flex-col justify-center items-center bg-white rounded-lg p-2">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 400, width: '100%' }} // Ensure width is responsive
              defaultView="month"
              views="month"
              eventPropGetter={eventStyleGetter}
            />
          </div>
  
          {/* Right - Leave Logs */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-4 overflow-y-auto max-h-96">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Leave Logs</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Applied Date</th>
                  <th className="px-4 py-2 text-left text-gray-600">Leave Type</th>
                  <th className="px-4 py-2 text-left text-gray-600">From Date</th>
                  <th className="px-4 py-2 text-left text-gray-600">To Date</th>
                  <th className="px-4 py-2 text-left text-gray-600">Reason</th>
                  <th className="px-4 py-2 text-left  text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {logData.map((log) => (
                  <tr key={log._id}>
                    <td className="px-4 py-2">{reverseDate(log.today)}</td>
                    <td className="px-4 py-2">{log.leaveType}</td>
                    <td className="px-4 py-2">{log.from.date}</td>
                    <td className="px-4 py-2">{log.to.date}</td>
                    <td className="px-4 py-2">{log.reason}</td>
                    <td className="px-4 py-2">
                      <div
                        className="w-3 h-3 rounded-full inline-block"
                        style={{
                          backgroundColor: getStatusColor(log.status),
                        }}
                      ></div>
                      <span
                        className="ml-2 font-semibold"
                        style={{
                          color: getStatusColor(log.status), // Change text color based on status
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
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
