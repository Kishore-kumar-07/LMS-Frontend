  import React, { useState, useEffect } from "react";
  import Nav from "./Nav";
  import Footer from "./Footer";
  import Employee from "./Employee";
  import Charts from "./Charts";
  import Card from "./Card";
  import PermissionTable from "./PermissionTable";
  import { jwtDecode } from "jwt-decode";
  import Table from "./Table";
  import axios from "axios";
  import { FaSearch } from "react-icons/fa";
  import './admin.css';
  import LineGraph from "./LineGraph";
  import { Gauge } from '@mui/x-charts/Gauge';

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
    const [cardData, setCardData] = useState([]);
    const [weekData, setWeekData] = useState([]);
    const [TotalRequests, setTotalRequests] = useState(0);
    const [pending, setpending] = useState(0);
    const [approved, setApproved] = useState(0);
    const [denied, setDenied] = useState(0);

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
      getCardData();
      getBarData();
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
        console.log("in admin home ", cardData.data );
        setCardData(cardData.data);
      } catch {
        console.log("error");
      }
    };

    const getBarData = async () => {
      try {
        const weekData = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/leave/weekData`,
          
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("in admin home ", weekData );
        setWeekData(weekData.data);
      } catch {
        console.log("error");
      }
    };

    useEffect(()=>{
      const total = cardData.length;
      const approved = cardData.filter((row)=> row.status === "Approved").length;
      const pending = cardData.filter((row)=> row.status === "Pending").length;
      const denied = total-approved-pending;
      setTotalRequests(total)
      setApproved(approved)
      setDenied(denied)
      setpending(pending)
    },[cardData])

    // Function to handle search query change
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    // Filter employees based on the search query
    const filteredEmployees = empAll.filter((employee) =>
      employee.empName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const handleClick = (index) => {
      
        console.log("after clicking", index);
        setSelectedEmployee(filteredEmployees[index]);
        setSelectedEmployeeIndex(index);
        setShowPopup(true);
      
    };

    const closePopup = () => {
      setSelectedEmployee(null);
      setSelectedEmployeeIndex(null);
      setShowPopup(false);
    };

    return (
      <>
        <div className="flex w-screen h-screen">
          <main className="flex flex-col w-screen h-screen">
            <Nav setIsRequest={setIsRequest} setIsPermission={setIsPermission} />
            <div className="w-full h-full">
              <div className="w-full h-[98%] flex justify-between items-center">
                <div className="w-[75%] h-full p-5">
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
                    <div className="flex justify-between">
                      <Card label="Total Leaves Requested" value={TotalRequests} image="gmail" />
                      <Card label="Total Pending" value={pending} image="gmail" />
                      <Card label="Total Leaves Granted" value={approved} image="accept" />
                      <Card label="Total Leaves Denied" value={denied} image="cancel" />
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
                        <div className="flex gap-10 justify-center items-center" >
                          <LineGraph colour_ = {"#4e79a7"}/>
                          <Gauge width={200} height={200} value={60} startAngle={-90} endAngle={90} />
                        </div>
                        
                      </div>
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
                    <div
                      key={index}
                      onClick={() => handleClick(index)}
                      className={`rounded-lg hover:cursor-pointer ${
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
          </main>
          
        </div>
        
      </>
    );
  };

  export default AdminHome;
