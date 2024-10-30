import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Employee from "./Employee";
import Charts from "./Charts";
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
import EmployeePopup from "./EmployeePopUp";

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
  const [employeeId, setEmployeeId] = useState("");

  const handleClick = (index, id) => {
    setEmployeeId(id);
    console.log("after clicking", index);
    setSelectedEmployee(filteredEmployees[index]);
    setSelectedEmployeeIndex(index);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedEmployee(null);
    setSelectedEmployeeIndex(null);
    setShowPopup(false);
    setEmployeeId("");
  };

  return (
    <>
      <div className="flex flex-col w-screen h-screen">
        <Nav
          setIsRequest={setIsRequest}
          setIsPermission={setIsPermission}
          setIsEmployees={setIsEmployees}
        />

        <div className="w-full h-full p-3 overflow-y-auto">
          {isEmployees ? (
            <div className="pt-5">
              <Details />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col lg:flex-row lg:justify-between lg:items-start">
              <div className="w-full lg:w-[75%] p-3">
                <div className="w-full flex justify-between gap-3 pb-5">
                  <div className="w-full lg:w-[30%]">
                    <select className="w-full border rounded-md p-2 focus:outline-none focus:ring">
                      {departments.map((row) => (
                        <option key={row}>{row}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full h-fit p-3 rounded-lg">
                  <div className="flex flex-wrap justify-between gap-3">
                    <Card
                      label="Leaves Requested"
                      value={TotalRequests}
                      image="gmail"
                    />
                    <Card label="Pending" value={pending} image="gmail" />
                    <Card
                      label="Leaves Granted"
                      value={approved}
                      image="accept"
                    />
                    <Card label="Leaves Denied" value={denied} image="cancel" />
                  </div>
                </div>

                <div className="flex flex-col mb-4">
                  {isRequest ? (
                    <div>
                      <Table cardData={getCardData} />
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
                </div>

                {showPopup && selectedEmployee && (
                  <div className="fixed inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="w-[90%] h-[90%] flex justify-center items-center">
                      <EmployeePopup
                        onClose={() => closePopup(false)}
                        employeeId={employeeId}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full lg:w-[25%] h-full border-x-2 pt-3 p-3 flex flex-col gap-2">
                <div className="flex gap-4 w-full justify-between p-1 rounded-lg mb-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 text-sm md:text-base"
                    placeholder="Search Employee"
                  />
                </div>

                <div className="overflow-y-auto h-[400px] sm:h-[500px] md:h-[600px]">
                  {filteredEmployees.map((employee, index) => (
                    <div
                      key={index}
                      onClick={() => handleClick(index, employee.empId)}
                      className={`rounded-lg hover:cursor-pointer p-2 transition-colors duration-200 ${
                        selectedEmployeeIndex === index
                          ? "bg-blue-100 shadow-lg"
                          : ""
                      }`}
                    >
                      <Employee
                        employeeName={employee.empName}
                        employeeType={employee.role}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminHome;

// Responsive Card component
const Card = (props) => {
  return (
    <div className="w-full md:w-[48%] lg:w-[250px] h-[120px] flex flex-col items-center justify-center border-2 border-gray-600 text-white gap-2 bg-[#f7f8f9] rounded-xl p-3">
      <div className="flex flex-row text-white">
        <p className="text-lg md:text-xl text-black">{props.label}</p>
      </div>
      <div className="text-3xl md:text-4xl font-semibold text-black">
        <p>{props.value}</p>
      </div>
    </div>
  );
};
