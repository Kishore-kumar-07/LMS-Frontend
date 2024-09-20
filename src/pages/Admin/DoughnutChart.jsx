import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";

const DoughnutChart = ({three_p , gvr}) => {

  

  Chart.register(ArcElement, Tooltip, Legend, Title);
  Chart.defaults.plugins.tooltip.backgroundColor = "";
  Chart.defaults.plugins.legend.position = "right";
  Chart.defaults.plugins.legend.title.display = true;
  Chart.defaults.plugins.legend.title.font = "Helvetica Neue";

  console.log("in donut",three_p , gvr)

  const data = {
    labels: ["GVR", "3P "],
    datasets: [
      {
        data: [gvr,three_p],
        backgroundColor: ["rgb(147 , 183, 190)", "rgb(23, 96, 135)"],
        borderWidth: 2,
        radius: "100%",
      },
    ],
  };

  return (
    <div className="w-[16rem] h-[14rem] flex  justify-center items-center p-0 mr-2">
      <div>
        {/* <h2>Requests Summary Widget</h2> */}
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default DoughnutChart;
