import React, { useState } from "react";
import EmployeeUserDetails from "./EmployeeUserDetails";
import OptionsCard from "./OptionsCard";
import { FaPrint } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { MdWatchLater } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import LeaveApply from "./Leave Apply/LeaveApply";
import PermissionApply from "./Permission Apply/PermissionApply";
import History from "./History/History";
import PaySlip from "./Pay Slip/PaySlip";
import Nav from "./Nav";
import { jwtDecode } from "jwt-decode";

function EmployeeHome() {
  const [option, setOption] = useState("Home");
  const [isPaternity, setIsPaternity] = useState(null);
  const [isAdoption, setIsAdoption] = useState(null);

  const token = document.cookie.split("=")[1];
 
  const decodedToken = jwtDecode(token);
 

  return (
    <>
      <div className="h-screen w-screen bg-gradient-to-l from-[#DAF0FF] from-60% to-white flex flex-col">
        <Nav setOption={setOption} />
        {option === "Home" ? (
          <div className="h-full w-full flex  items-center justify-center">
            <div className="w-[90%] h-[90%] flex justify-around items-center p-5">
              <div className="">
                <EmployeeUserDetails
                  setIsPaternity={setIsPaternity}
                  setIsAdoption={setIsAdoption}
                />
              </div>
              <div className="flex flex-col justify-center h-[80%] w-[40%] items-center  text-lg font-semibold ">
                <div className="w-full h-full flex flex-col justify-evenly">
                  <OptionsCard
                    name={"Apply Leave"}
                    icon={<SlCalender />}
                    setOption={setOption}
                    value="Leave"
                  />
                  <OptionsCard
                    name={"Apply Permission "}
                    icon={<MdWatchLater />}
                    setOption={setOption}
                    value="Permission"
                  />
                  <OptionsCard
                    name={"History"}
                    icon={<FaHistory />}
                    setOption={setOption}
                    value="History"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : option === "Leave" ? (
          <LeaveApply isPaternity={isPaternity} isAdoption={isAdoption} />
        ) : option === "Permission" ? (
          <PermissionApply />
        ) : option === "History" ? (
          <History />
        ) : option === "PaySlip" ? (
          <PaySlip />
        ) : (
          ""
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full text-black  text-center text-sm p-2">
        <a href="https://sece.ac.in/" target="_blank" rel="noopener noreferrer">
          Copyright©2024 Sri Eshwar College of Engineering
        </a>
      </div>
    </>
  );
}

export default EmployeeHome;
