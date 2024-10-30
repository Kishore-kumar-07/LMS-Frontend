import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { jwtDecode } from "jwt-decode";
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
    labels: [],
    datasets: [
      {
        label: "Leaves",
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: [],
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

      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);

      const filteredLeaves = weekDataResponse.data.filter((leave) => {
        const leaveDate = new Date(leave.today);
        return leaveDate >= lastWeek && leaveDate <= today;
      });

      const leaveCountByDay = {};
      filteredLeaves.forEach((leave) => {
        const leaveDateObj = new Date(leave.today);
        const leaveDate =
          leaveDateObj.toLocaleString("en-US", { month: "short" }) +
          " " +
          leaveDateObj.getDate() +
          " " +
          leaveDateObj.getFullYear();

        if (leaveCountByDay[leaveDate]) {
          leaveCountByDay[leaveDate]++;
        } else {
          leaveCountByDay[leaveDate] = 1;
        }
      });

      const labels = Object.keys(leaveCountByDay);
      const leaveCounts = Object.values(leaveCountByDay);

      setChartData({
        labels,
        datasets: [
          {
            label: "Leaves per Day",
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
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
    <div className="w-full h-full flex justify-center items-center">
      <div className=" w-full h-auto flex justify-center items-center">
        <div className="lg:w-full md:w-[75%] h-54 p-1">
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
