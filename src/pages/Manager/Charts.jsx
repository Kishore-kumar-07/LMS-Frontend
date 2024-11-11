import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import LineGraph from './LineGraph';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';

const Charts = () => {
  const [data, setData] = useState([]);
  const [gvr, setGvr] = useState(0);
  const [three_p, setThree_p] = useState(0);

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
      { empId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

    const leaveData = response.data;
    console.log(response.data) 
    const three_p = leaveData
  .filter((row) => row.role === "3P" && row.status === "Approved") 
  .reduce((sum, row) => sum + row.leaveDays, 0); 
    
    const gvr = leaveData
    .filter((row) => row.role === "GVR" && row.status === "Approved") // Filter by key
    .reduce((sum, row) => sum + row.leaveDays, 0); 
    console.log(three_p , gvr)

    setGvr(gvr);
    setThree_p(three_p);
    setData(leaveData);
  };

  return (
    <div className="">
      <div className="w-full h-fit  rounded-lg mb-3 border border-[#c0c0c0] bg-white">
        <div className="flex md:flex-col lg:flex-row flex-wrap">
          <div className="flex-1 flex justify-center items-center">
            <BarChart />
          </div>
          <div class="border border-black-300 "></div>

          <div className="flex-1 flex justify-center items-center">
            <DoughnutChart three_p={three_p} gvr={gvr} />
          </div>
        </div>
      </div>

      <div className="w-full rounded-lg mt-4 h-[100%] bg-white p-2">
        
        <LineGraph />
      </div>
    </div>
  );
};

export default Charts;
