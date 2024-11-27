import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";


const DoughnutChart = ({ three_p, gvr }) => {
  Chart.register(ArcElement, Tooltip, Legend, Title);
  Chart.defaults.plugins.tooltip.backgroundColor = "";
  Chart.defaults.plugins.legend.position = "right";
  Chart.defaults.plugins.legend.title.display = true;
  Chart.defaults.plugins.legend.title.font = "Helvetica Neue";


  const data = {
    labels: ["GVR", "3P"],
    datasets: [
      {
        data: [gvr, three_p],
        backgroundColor: ["rgb(147, 183, 190)", "rgb(23, 96, 135)"],
        borderWidth: 2,
        radius: "100%",
      },
    ],
  };

  const todayYear = new Date().getFullYear();

  return (
    
    <div className="flex flex-col  justify-center items-center p-1 w-full h-full max-w-md">
      
      <div className="w-full flex justify-end items-center">
      
      </div>
      
      <div className="h-fit">
      <Doughnut data={data} options={{ maintainAspectRatio: false }}  />
      </div>
      <p className="pr-20 font-semibold">Monthly Leave by Role</p>
    </div>
  );
};

export default DoughnutChart;
