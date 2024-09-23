import React from 'react'
import BarChart from './BarChart'
import DoughnutChart from './DoughnutChart'
import LineGraph from './LineGraph'
import { jwtDecode } from "jwt-decode";
import { useEffect ,useState} from 'react';
import axios from 'axios';

const Charts = () => {

  const [data,setData] = useState([]);
  const [gvr , setGvr] = useState(0);
  const [three_p , setThree_p] = useState(0);


  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  useEffect(()=>{
    getData();
  },[])

  const getData = async () => {
    const data = await axios.post(`${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
    {
      empId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    console.log("data in chart page is ",data);
    const three_p = data.data.filter((row) => row.role === "3P").length;
    const gvr = data.data.length - three_p;
  console.log(three_p , gvr)
  setGvr(gvr);
  setThree_p(three_p);
    setData(data);
  }

  console.log("in charts" , gvr , three_p)

  return (
    <div className=''>
              <div className="w-full h-fit p-1 rounded-lg mb-3 border border-[#c0c0c0]">
                <div className="flex justify-evenly">
                  <div>
                  <BarChart />
                  </div>
                  {/* <DoughnutChart/> */}
                  <div>
                  <DoughnutChart three_p = {three_p}  gvr = {gvr}/>
                  </div>
                </div>
              </div>
              <div className="rounded-lg flex ">
                <LineGraph />
                {/* <LineGraph /> */}
              </div>
            </div>
  )
}

export default Charts