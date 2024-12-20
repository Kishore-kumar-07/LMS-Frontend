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
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);

const BarChart = ({department_ , changeInDept , gender , changeInGender , unit , changeInUnit , subDept , changeInSubDept}) => {
  
BarChart.propTypes = {
  department_: PropTypes.string.isRequired,
  changeInDept: PropTypes.number.isRequired,
  gender: PropTypes.string.isRequired,
  changeInGender: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  changeInUnit: PropTypes.number.isRequired,
  subDept: PropTypes.string.isRequired,
  changeInSubDept: PropTypes.number.isRequired,
};

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
  }, [changeInDept , changeInGender ,changeInUnit , changeInSubDept ]);

  const getWeekData = async () => {
    try {
      const weekDataResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/weekData`,
        { empId : empId ,
          department : department_,
          subDepartment : subDept ,
          unit : unit,
          gender : gender
         },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      dates.unshift(formattedDate); 
    }

      // Count leaves by day
      const leaveCounts = weekDataResponse.data.weekData.reverse(); 
     

    // Update the chartData state
    setChartData({
      labels: dates, 
      datasets: [
        {
          label: "Leaves",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          data: leaveCounts, 
        },
      ],
    });

      setWeekData(weekDataResponse);
    } catch (error) {
      console.log("Error fetching week data", error);
    }
  };

  return (
    <div className="w-full h-full flex-col flex justify-center items-center">
      
      <div className=" w-full h-auto flex justify-center items-center">
        <div className="lg:w-full md:w-[60%] h-54 p-1">
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
      <p className="font-semibold">Leave Count by Date</p>
    </div>
  );
};

export default BarChart;
