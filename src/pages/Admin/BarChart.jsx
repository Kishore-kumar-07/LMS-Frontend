import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);

const BarChart = () => {
  const [weekData, setWeekData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [], // To hold the days or departments
    datasets: [
      {
        label: 'Leaves',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: [], // To hold the number of leaves per day/department
      },
    ],
  });

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  useEffect(() => {
    getWeekData();
  }, []);

  const getWeekData = async () => {
    try {
      const weekDataResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/leave/weekData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetched week data:", weekDataResponse.data);

      // Filter and process the leaves
      const today = new Date();
      console.log(today)
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);

      const filteredLeaves = weekDataResponse.data.filter(leave => {
        const leaveDate = new Date(leave.today);
        console.log("leave date is ",leaveDate)
        return leaveDate >= lastWeek && leaveDate <= today;
      });

      // Group leaves by date or department (for now, grouping by date)
      const leaveCountByDay = {};
      console.log(filteredLeaves)
      filteredLeaves.forEach(leave => {
        const leaveDateObj = new Date(leave.today);
        const leaveDate = leaveDateObj.toLocaleString('en-US', { weekday: 'short' }) + ' ' +
                    leaveDateObj.toLocaleString('en-US', { month: 'short' }) + ' ' +
                    leaveDateObj.getDate() + ' ' +
                    leaveDateObj.getFullYear();
         
         console.log(leaveDate)
        if (leaveCountByDay[leaveDate]) {
          leaveCountByDay[leaveDate]++;
        } else {
          leaveCountByDay[leaveDate] = 1;
        }
      });

      // Prepare labels and data for the chart
      const labels = Object.keys(leaveCountByDay);
      const leaveCounts = Object.values(leaveCountByDay);
      console.log(labels)
      console.log(leaveCounts)

      // Update the chart data
      setChartData({
        labels,
        datasets: [
          {
            label: 'Leaves per Day',
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            data: leaveCounts,
          },
        ],
      });

      setWeekData(filteredLeaves);
    } catch (error) {
      console.log("Error fetching week data", error);
    }
  };

  return (
    <div className="w-[40rem] h-[14rem] flex justify-center items-center p-0">
      <Bar data={chartData} width={200} height={70} />
    </div>
  );
};

export default BarChart;
