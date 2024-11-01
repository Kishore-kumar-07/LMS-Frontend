import React, { useEffect } from 'react'
import Nav from './Nav'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Employee from './Employee';
import Leaves from './Leaves';
import Permission from './Permission';

const ManagerHome = () => {
  const navigation = useNavigate();
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [isRequest, setIsRequest] = useState(false);
  const [isPermission, setIsPermission] = useState(false);
  const [isEmployees, setIsEmployees] = useState(true);
  const [empAll, setEmpAll] = useState([]);

  // useEffect(()=>{
  //   getAllEmployee();
  // },[])

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
      console.log("in manager home ", allEmp);
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

  return (
    <>
    <div className='h-screen w-screen flex flex-col'>
        <Nav setIsRequest={setIsRequest}
          setIsPermission={setIsPermission}
          setIsEmployees={setIsEmployees} 
          />
          <div className='w-full h-full'>
          {isEmployees ? (
            <div className="">
              <Employee />
            </div>
          ) : isPermission ?  (
            <Permission/>
          ) :  (
            <Leaves/>
          )}

          </div>

    </div>
    </>
  )
}

export default ManagerHome