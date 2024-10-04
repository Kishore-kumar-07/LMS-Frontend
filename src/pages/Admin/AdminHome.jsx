import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Employee from "./Employee";
import Charts from "./Charts";
// import Card from "./Card";
import PermissionTable from "./PermissionTable";
import { jwtDecode } from "jwt-decode";
import Table from "./Table";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "./admin.css";
import LineGraph from "./LineGraph";
import { Gauge } from "@mui/x-charts/Gauge";
import Circular from "./Circular";
import Details from "./Details";

const AdminHome = () => {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const [searchTerm, setSearchTerm] = useState("");

  

  const headers = [
    "Name",
    "Employee-Type",
    "Leave-Type",
    "From",
    "To",
    "Days",
    "Reason",
    "Action",
  ];

  const [empAll, setEmpAll] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [TotalRequests, setTotalRequests] = useState(0);
  const [pending, setpending] = useState(0);
  const [approved, setApproved] = useState(0);
  const [denied, setDenied] = useState(0);

  const departments = [
    "All Departments",
    "Computer Science",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Biomedical Engineering",
  ];

  const [isRequest, setIsRequest] = useState(false);
  const [isPermission, setIsPermission] = useState(false);
  const [isEmployees, setIsEmployees] = useState(false);

  useEffect(() => {
    getAllEmployee();
    getCardData();
  }, []);

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
      console.log("in admin home ", allEmp);
      setEmpAll(allEmp.data);
    } catch {
      console.log("error");
    }
  };

  const getCardData = async () => {
    try {
      const cardData = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/leave/cardData`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("in admin home ", cardData.data);
      setCardData(cardData.data);
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    const total = cardData.length;
    const approved = cardData.filter((row) => row.status === "Approved").length;
    const pending = cardData.filter((row) => row.status === "Pending").length;
    const denied = total - approved - pending;
    setTotalRequests(total);
    setApproved(approved);
    setDenied(denied);
    setpending(pending);
  }, [cardData]);

  // Function to handle search query change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter employees based on the search query
  const filteredEmployees = empAll.filter((employee) =>
    employee.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");

  // const [activeTab, setActiveTab] = useState("employee");

  const handleClick = (index) => {
    console.log("after clicking", index);
    setSelectedEmployee(filteredEmployees[index]);
    setSelectedEmployeeIndex(index);
    setShowPopup(true);
  };

  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // };

  const closePopup = () => {
    setSelectedEmployee(null);
    setSelectedEmployeeIndex(null);
    setShowPopup(false);
  };

  

  return (
    <>
      <div className="flex w-screen h-screen">
        <main className="flex flex-col w-screen h-screen">
          <Nav setIsRequest={setIsRequest} setIsPermission={setIsPermission} setIsEmployees={setIsEmployees} />
          <div className="w-full h-full">
          {isEmployees ? (
                <div className="pt-5">
                  <Details />
                </div>
              ) : 
            (<div className="w-full h-full flex justify-between items-center">
                
              <div className="w-[75%] h-full p-5">
                <div className="h-20px w-full flex justify-between gap-10 pb-5">
                  <div className="w-[30%]">
                    <select
                      className={`w-full border rounded-md p-2 focus:outline-none focus:ring `}
                    >
                      {departments.map((row) => (
                        <option>{row}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-full h-fit p-3 rounded-lg">
                  <div className="flex justify-between">
                    <Card
                      label=" Leaves Requested"
                      value={TotalRequests}
                      image="gmail"
                    />
                    <Card label=" Pending" value={pending} image="gmail" />
                    <Card
                      label=" Leaves Granted"
                      value={approved}
                      image="accept"
                    />
                    <Card
                      label=" Leaves Denied"
                      value={denied}
                      image="cancel"
                    />
                  </div>
                </div>
                {isRequest ? (
                  <div>
                    <Table cardData = {getCardData}/>
                  </div>
                ) : isPermission ? (
                  <div>
                    <PermissionTable />
                  </div>
                ) : (
                  <div>
                    <Charts />
                  </div>
                )}
                {showPopup && selectedEmployee && (
                  <div className=" fixed inset-0 flex items-center justify-center ">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-8 rounded-lg w-[50%]  relative">
                      <button
                        className="absolute top-2 right-2 text-black text-5xl"
                        onClick={closePopup}
                      >
                        &times;
                      </button>
                      <h1 className="text-2xl font-bold mb-4">
                        {selectedEmployee.empName}'s Details
                      </h1>
                      <div className="flex flex-col space-y-2">
                        <div className="flex">
                          <h2 className="text-lg font-semibold">Type:</h2>
                          <span className="ml-2">{selectedEmployee.role}</span>
                        </div>
                        <div className="flex">
                          <h2 className="text-lg font-semibold">ID:</h2>
                          <span className="ml-2">{selectedEmployee.empId}</span>
                        </div>
                      </div>
                      <div className="flex gap-10 justify-center items-center">
                        <LineGraph colour_={"#4e79a7"} />
                        <Gauge
                          width={200}
                          height={200}
                          value={60}
                          startAngle={-90}
                          endAngle={90}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full sm:w-[25%] h-full border-x-2 solid pt-3 p-3 flex flex-col gap-2">
                {/* Tab navigation */}
                <div className="flex gap-4 w-full justify-around p-1 rounded-lg">
                <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full max-w-md p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
          placeholder="Search Employee"
        />
        </div>

                {/* Content rendering with responsive behavior */}
                <div className="overflow-y-auto h-[500px] sm:h-[600px]">
                  {
                    filteredEmployees.map((employee, index) => (
                      <div
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`rounded-lg hover:cursor-pointer p-2 ${
                          selectedEmployeeIndex === index
                            ? "bg-blue-100 shadow-lg"
                            : ""
                        }`}
                      >
                        <div>
                          <Employee
                            employeeName={employee.empName}
                            employeeType={employee.role}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>)}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminHome;

const Card = (props) => {
  // const imageSrc = images[props.image];

  return (
    <div className="w-[250px] h-[120px] flex flex-col items-center justify-center border-2 border-gray-600 text-white gap-2 bg-[#f7f8f9] rounded-xl p-3  ">
      <div className="flex flex-row text-white">
        <p className="text-xl text-black">{props.label}</p>
      </div>

      <div className="text-4xl font-semibold text-black">
        <p>{props.value}</p>
      </div>

      {/* {imageSrc && (
        <img
          src={imageSrc}
          alt={props.imageName}
          className="absolute bottom-2 right-2 w-14 h-14 opacity-50"
        />
      )} */}
    </div>
    
  );
};
