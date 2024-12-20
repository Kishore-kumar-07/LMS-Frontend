import React from "react";
import UserIcon from "./assets/user.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function EmployeeUserDetails({ setIsPaternity, setIsAdoption }) {

  EmployeeUserDetails.propTypes = {
    setIsPaternity: PropTypes.func.isRequired,
    setIsAdoption: PropTypes.func.isRequired,
  };


  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/emp/getEmp`,
          { empId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

       

        if (res.status === 401) {
          
          navigate("/thank-you");
        }

        setUserDetails(res.data[0]);
        setIsPaternity(res.data[0].isPaternity);
        setIsAdoption(res.data[0].isAdpt);
      } catch (error) {
        if (error.response.status === 400) {
          navigate("/error404");
        }
        if (error.response.status === 500) {
          navigate("/error500");
        }
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, [empId, token]);

  return (
    <>
      <div className="w-full flex flex-col gap-5 p-5 ">
        <div className="w-full flex justify-center items-center">
          <img src={UserIcon} alt="USER PROFILE" className="w-20 " />
        </div>
        <div className="flex items-center gap-3 text-3xl  font-bold justify-center">
          <h1>{decodedToken.empName}</h1>
        </div>

        <table className="table-auto w-full mt-2 text-left">
          <tbody>
          <tr className="">
              <th scope="col"> </th>
              <th scope="col"> </th>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Designation:</td>
              <td className="text-lg py-2">{userDetails.role}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">
                Reporting Manager:
              </td>
              <td className="text-lg py-2 ">{userDetails.manager}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">DOJ:</td>
              <td className="text-lg py-2">{userDetails.dateOfJoining}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Function:</td>
              <td className="text-lg py-2">{userDetails.function}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Department:</td>
              <td className="text-lg py-2">{userDetails.department}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Band/Level:</td>
              <td className="text-lg py-2">{userDetails.level}</td>
            </tr>
            <tr className="">
              <td className="font-bold text-lg py-2 pr-6">Location:</td>
              <td className="text-lg py-2">{userDetails.location}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EmployeeUserDetails;
