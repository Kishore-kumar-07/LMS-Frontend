import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Sidenav from "./Sidenav";
import Employee from "./Employee";
import Charts from "./Charts";
import Card from "./Card";
import PermissionTable from "./PermissionTable";
import {jwtDecode} from "jwt-decode";
import Table from "./Table";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const AdminHome = () => {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const [searchQuery, setSearchQuery] = useState('');

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

  const departments = [
    "Computer Science",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Biomedical Engineering",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReason, setSelectedReason] = useState(null);
  const rowsPerPage = 6; // Adjust as needed

  const [isRequest, setIsRequest] = useState(false);
  const [isPermission, setIsPermission] = useState(false);

  useEffect(() => {
    getAllEmployee();
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

  // Function to handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter employees based on the search query
  const filteredEmployees = empAll.filter((employee) =>
    employee.empName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex w-screen h-screen">
      <Sidenav setIsRequest={setIsRequest} setIsPermission={setIsPermission} />
      <main className="flex flex-col pt-2 w-screen h-screen">
        <Nav />
        <div className="w-full h-full">
          <div className="w-full h-[98%] flex justify-between items-center">
            <div className="w-[75%] h-full p-5 ">
              <div className="h-20px w-full flex justify-between gap-10 pb-5">
                <div className="w-[48%]">
                  <select
                    className={`w-full border rounded-md p-2 focus:outline-none focus:ring `}
                  >
                    <option value="">Select Department</option>
                    {/* Add other department options based on the decoded token */}
                  </select>
                </div>
              </div>
              <div className="w-full h-fit p-3 rounded-lg">
                <div className="flex justify-between ">
                  <Card label="Total Leaves Requested" value="20" image="gmail" />
                  <Card label="Total Leaves Granted" value="15" image="accept" />
                  <Card label="Total Leaves Denied" value="5" image="cancel" />
                </div>
              </div>
              {isRequest ? (
                <div>
                  <Table />
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
            <div className="w-[25%] h-[100%] border-x-2 solid pt-3 p-3 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <FaSearch />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Employee"
                  className="border-2 p-2 rounded-lg w-full"
                />
              </div>

              {/* Render filtered employee list */}
              {filteredEmployees.map((employee, index) => (
                <Employee
                  key={index}
                  employeeName={employee.empName}
                  employeeType={employee.role}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal for displaying reason */}
      </main>
      <div className="fixed bottom-0 left-0 w-full text-black text-center text-sm p-2">
        <a href="https://sece.ac.in/" target="_blank" rel="noopener noreferrer">
          Copyright©2024 Sri Eshwar College of Engineering
        </a>
      </div>
    </div>
  );
};

export default AdminHome;
