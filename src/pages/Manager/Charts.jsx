import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import LineGraph from './LineGraph';
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Charts = ({department_ , changeInDept , unit , changeInUnit , gender , changeInGender , subDept , changeInSubDept}) => {

  const navigation = useNavigate();

  const newDate = new Date().getFullYear();
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1; 
 

  const [data, setData] = useState([]);
  const [gvr, setGvr] = useState(0);
  const [three_p, setThree_p] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [empAll, setEmpAll] = useState([]);


  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  

  useEffect(() => {
    getData();
    getAllEmployee();
  }, []);

  // Re-run the filter when selectedYear or data changes
  useEffect(() => {
    filterDataByYear(selectedYear, data);
  }, [selectedYear, data , changeInDept , changeInGender , changeInUnit , changeInSubDept]);

  useEffect(()=>{
    filterDataByMonth(selectedMonth, data);
  },[data ,selectedMonth , changeInDept , changeInGender , changeInUnit , changeInSubDept])

  const getAllEmployee = async () => {
    try {
      const allEmp = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/getAll`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setEmpAll(allEmp.data);
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
      console.log("error");
    }
  };

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
    setData(leaveData); 
  };

  const handleChangeYear = (e) => {
    setSelectedYear(e.target.value);
  };
  const handleChangeMonth = (e) => {
    setSelectedMonth(e.target.value);
  };

  const filterDataByYear = (year, data) => {
   
    const filteredData = data.filter(row => {
      const [day, month, yearStr] = row.from.date.split("/"); // Split "DD/MM/YYYY"
      return parseInt(yearStr) === parseInt(year) && parseInt(month) === parseInt(selectedMonth);
    });

    const three_p = filteredData
  .filter((row) => {
    // Find the corresponding employee object based on the employee ID (or another key)
    const employee = empAll.find(emp => emp.empId === row.empId); // Assuming `employeeId` links to `empAll`
    return (
      (department_ === "All Departments" || employee.department === department_) &&
      (unit === "All Units" || employee.unit === unit) && 
      (gender === "All Gender" || employee.gender === gender) &&
      (subDept === "All Sub Departments" || employee.subDepartment === subDept) &&
      row.role === "3P" &&
      row.status === "Approved"
    );
  })
  .reduce((sum, row) => sum + row.leaveDays, 0);

const gvr = filteredData
  .filter((row) => {
    // Find the corresponding employee object based on the employee ID (or another key)
    const employee = empAll.find(emp => emp.empId === row.empId); // Assuming `employeeId` links to `empAll`
    return (
      (department_ === "All Departments" || employee.department === department_) &&
      (unit === "All Units" || employee.unit === unit) && 
      (gender === "All Gender" || employee.gender === gender) &&
      (subDept === "All Sub Departments" || employee.subDepartment === subDept) &&

      row.role === "GVR" &&
      row.status === "Approved"
    );
  })
  .reduce((sum, row) => sum + row.leaveDays, 0);

    setGvr(gvr);
    setThree_p(three_p);
  };

  const filterDataByMonth = (month_, data) => {
    
    const filteredData = data.filter(row => {
      const [day, month, yearStr] = row.from.date.split("/"); // Split "DD/MM/YYYY"
      return parseInt(month) === parseInt(month_) && parseInt(yearStr) === parseInt(selectedYear);
    });
   
    const three_p = filteredData
  .filter((row) => {
    // Find the corresponding employee object based on the employee ID (or another key)
    const employee = empAll.find(emp => emp.empId === row.empId); // Assuming `employeeId` links to `empAll`
    return (
      (department_ === "All Departments" || employee.department === department_) &&
      (unit === "All Units" || employee.unit === unit) && 
      (gender === "All Gender" || employee.gender === gender) &&
      (subDept === "All Sub Departments" || employee.subDepartment === subDept) &&

      row.role === "3P" &&
      row.status === "Approved"
    );
  })
  .reduce((sum, row) => sum + row.leaveDays, 0);

const gvr = filteredData
  .filter((row) => {
    // Find the corresponding employee object based on the employee ID (or another key)
    const employee = empAll.find(emp => emp.empId === row.empId); // Assuming `employeeId` links to `empAll`
    return (
      (department_ === "All Departments" || employee.department === department_) &&
      (unit === "All Units" || employee.unit === unit) && 
      (gender === "All Gender" || employee.gender === gender) &&
      (subDept === "All Sub Departments" || employee.subDepartment === subDept) &&

      row.role === "GVR" &&
      row.status === "Approved"
    );
  })
  .reduce((sum, row) => sum + row.leaveDays, 0);

    setGvr(gvr);
    setThree_p(three_p);
  };

  return (
    <div className="">
      <div className="w-full h-fit rounded-lg mb-3 border border-[#c0c0c0] bg-white">
        <div className="flex md:flex-col lg:flex-row flex-wrap">
          <div className="flex-1 flex justify-center items-center">
            <BarChart department_ = {department_} changeInDept = {changeInDept} gender = {gender} changeInGender = {changeInGender} unit = {unit} changeInUnit = {changeInUnit} subDept = {subDept} changeInSubDept = {changeInSubDept}/>
          </div>
          <div className="border border-black-300"></div>

          <div className="flex flex-1 flex-col p-1 justify-center items-center">
            <div className='w-full flex justify-end items-center pr-3 gap-5'>
              <select 
                className='border p-1 rounded-lg border-gray border-2 w-[20%]' 
                onChange={handleChangeYear}
                value={selectedYear}
              >
                <option value={newDate}>{newDate}</option>
                <option value={newDate - 1}>{newDate - 1}</option>
                <option value={newDate - 2}>{newDate - 2}</option>
              </select>
              <select 
                className='border p-1 rounded-lg border-gray border-2 w-[20%]' 
                onChange={handleChangeMonth}
                value={selectedMonth}
              >
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">Mar</option>
                <option value="04">Apr</option>
                <option value="05">May</option>
                <option value="06">Jun</option>
                <option value="07">Jul</option>
                <option value="08">Aug</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
              </select>
            </div>
            <DoughnutChart three_p={three_p} gvr={gvr} />
          </div>
        </div>
      </div>

      <div className="w-full rounded-lg mt-4 h-full bg-white p-2 border border-[#c0c0c0]">
        <LineGraph department_ = {department_} changeInDept = {changeInDept} gender = {gender} changeInGender = {changeInGender} unit = {unit} changeInUnit = {changeInUnit} subDept = {subDept} changeInSubDept = {changeInSubDept}/>
      </div>
    </div>
  );
};

export default Charts;
