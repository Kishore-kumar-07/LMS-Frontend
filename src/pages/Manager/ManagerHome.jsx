import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Employee from "./Employee";
import Charts from "./Charts";
import PermissionTable from "./PermissionTable";
import { jwtDecode } from "jwt-decode";
import Table from "./Table";
import axios from "axios";
import "./admin.css";
import Details from "./Details";
import EmployeePopup from "./EmployeePopUp";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigate();
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
  const [leaveCardData, setLeaveCardData] = useState([]);
  const [permissionCardData, setPermissionCardData] = useState([]);
  const [totalLeaveRequests, setTotalLeaveRequests] = useState(0);
  const [leavesPending, setLeavesPending] = useState(0);
  const [leavesApproved, setLeavesApproved] = useState(0);
  const [leavesDenied, setLeavesDenied] = useState(0);
  const [totalPermissionRequests, setTotalPermissionRequests] = useState(0);
  const [permissionPending, setPermissionPending] = useState(0);
  const [permissionApproved, setPermissionApproved] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentMain, setSelectedDepartmentMain] =
    useState("All Departments");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState(
    "All Sub Departments"
  );
  const [selectedGender, setSelectedGender] = useState("All Gender");
  const [selectedUnit, setSelectedUnit] = useState("All Units");
  const [changeInDept, setChangeInDept] = useState(false);
  const [changeInSubDept, setChangeInSubDept] = useState(false);
  const [changeInGender, setChangeInGender] = useState(false);
  const [changeInUnit, setChangeInUnit] = useState(false);

  const departments = [
    "All Departments",
    "Manufacturing",
    "Store",
    "Quality",
    "Manufacturing Engineering",
    "Facilities and Maintenance",
    "Sourcing",
    "Planning",
    "Human Resource",
    "Customer Support",
    "Finance",
    "EHS",
    "TACC Lab",
    "Engineering",
  ];

  const subDepartments = [
    "All Sub Departments",
    "Cable Assembly",
    "Customer Quality",
    "Despatch",
    "EHS",
    "Engineering",
    "Facilities",
    "Finance",
    "Gpu",
    "Human Resources",
    "In Store",
    "Inward",
    "Logistics",
    "Main Assembly",
    "Maintenance",
    "Manifold",
    "Master Scheduling",
    "ME",
    "Meterline",
    "MLD",
    "Nozzle",
    "Plant Quality",
    "Sourcing",
    "Stp",
    "Sub Assembly",
    "Supplier Quality",
    "TACC",
  ];

  const gender = ["All Gender", "Male", "Female"];

  const units = ["All Units", "DTA", "EOU", "DTA/EOU"];

  const [isRequest, setIsRequest] = useState(false);
  const [isPermission, setIsPermission] = useState(false);
  const [isEmployees, setIsEmployees] = useState(false);

  useEffect(() => {
    getAllEmployee();
    getLeaveCardData();
    getPermissionCardData();
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

  const getLeaveCardData = async () => {
    try {
      const cardData = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("in manager home ", cardData.data.length);
      setLeaveCardData(cardData.data);
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

  const getPermissionCardData = async () => {
    try {
      const cardData = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/getPermission`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("in manager home ", cardData.data.length);
      setPermissionCardData(cardData.data);
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

  useEffect(() => {
    const totalLeave = leaveCardData.filter((row) => {
      // Find the employee object from empAll based on employeeId
      const employee = empAll.find((emp) => emp.empId === row.empId);

      return (
        row.status !== "Withdrawn" &&
        (selectedDepartmentMain === "All Departments" ||
          (employee && employee.department === selectedDepartmentMain)) &&
        (selectedSubDepartment === "All Sub Departments" || (employee && employee.subDepartment === selectedSubDepartment)) &&
        (selectedGender === "All Gender" || (employee && employee.gender === selectedGender)) &&
        (selectedUnit === "All Units" ||
          (employee && employee.unit === selectedUnit))
      );
    }).length;

    const leavePending = leaveCardData.filter((row) => {
      // Find the employee object from empAll based on employeeId
      const employee = empAll.find((emp) => emp.empId === row.empId);

      return (
        row.status === "Pending" &&
        (selectedDepartmentMain === "All Departments" ||
          (employee && employee.department === selectedDepartmentMain)) &&
        (selectedSubDepartment === "All Sub Departments" || (employee && employee.subDepartment === selectedSubDepartment)) &&
        (selectedGender === "All Gender" || (employee && employee.gender === selectedGender)) &&
        (selectedUnit === "All Units" ||
          (employee && employee.unit === selectedUnit))
      );
    }).length;

    const leaveApproved = leaveCardData.filter((row) => {
      // Find the employee object from empAll based on employeeId
      const employee = empAll.find((emp) => emp.empId === row.empId);

      return (
        row.status === "Approved" &&
        (selectedDepartmentMain === "All Departments" ||
          (employee && employee.department === selectedDepartmentMain)) &&
        (selectedSubDepartment === "All Sub Departments" || (employee && employee.subDepartment === selectedSubDepartment)) &&
        (selectedGender === "All Gender" || (employee && employee.gender === selectedGender)) &&
        (selectedUnit === "All Units" ||
          (employee && employee.unit === selectedUnit))
      );
    }).length;

    const leaveDenied = leaveCardData.filter((row) => {
      // Find the employee object from empAll based on employeeId
      const employee = empAll.find((emp) => emp.empId === row.empId);

      return (
        row.status === "Denied" &&
        (selectedDepartmentMain === "All Departments" ||
          (employee && employee.department === selectedDepartmentMain)) &&
        (selectedSubDepartment === "All Sub Departments" || (employee && employee.subDepartment === selectedSubDepartment)) &&
        (selectedGender === "All Gender" || (employee && employee.gender === selectedGender)) &&
        (selectedUnit === "All Units" ||
          (employee && employee.unit === selectedUnit))
      );
    }).length;

    setTotalLeaveRequests(totalLeave);
    setLeavesPending(leavePending);
    setLeavesApproved(leaveApproved);
    setLeavesDenied(leaveDenied);

    console.log(permissionCardData);

    const totalPermission = permissionCardData.filter((row) => {
      // Find the employee object from empAll based on employeeId
      const employee = empAll.find((employee) => employee.empId === row.empId);
      // console.log(employee);
      // console.log(selectedUnit);

      return (
        (selectedDepartmentMain === "All Departments" ||
        (employee && employee.department === selectedDepartmentMain)) &&
        (selectedSubDepartment === "All Sub Departments" || (employee && employee.subDepartment === selectedSubDepartment)) &&
        (selectedGender === "All Gender" || (employee && employee.gender === selectedGender)) &&
        (selectedUnit === "All Units" || (employee && employee.unit === selectedUnit)))
      ;
    }).length;

    console.log(totalPermission);

    const permissionPending = permissionCardData.filter((row) => {
      // Find the employee object from empAll based on employeeId
      const employee = empAll.find((employee) => employee.empId === row.empId);

      return (
        row.status === "Pending" &&
        (selectedDepartmentMain === "All Departments" ||
          (employee && employee.department === selectedDepartmentMain)) &&
        (selectedSubDepartment === "All Sub Departments" || (employee && employee.subDepartment === selectedSubDepartment)) &&
        (selectedGender === "All Gender" || (employee && employee.gender === selectedGender)) &&
        (selectedUnit === "All Units" || (employee && employee.unit === selectedUnit))
      );
    }).length;

    const permissionApproved = permissionCardData.filter((row) => {
      // Find the employee object from empAll based on employeeId
      console.log(selectedUnit);
      const employee = empAll.find((employee) => employee.empId === row.empId);

      return (
        row.status === "Approved" &&
        (selectedDepartmentMain === "All Departments" ||
          (employee && employee.department === selectedDepartmentMain)) &&
        (selectedSubDepartment === "All Sub Departments" || (employee && employee.subDepartment === selectedSubDepartment)) &&
        (selectedGender === "All Gender" || (employee && employee.gender === selectedGender)) &&
        (selectedUnit === "All Units" || (employee && employee.unit === selectedUnit))
      );
    }).length;

    // const permissionDenied = permissionCardData.filter((row) => {
    //   // Find the employee object from empAll based on employeeId
    //   const employee = empAll.find(emp => emp.id === row.employeeId);

    //   return (
    //     row.status === "Rejected" &&
    //     (selectedDepartmentMain === "All Departments" || (employee && employee.department === selectedDepartmentMain))
    //   );
    // }).length;

    console.log(totalPermission, permissionPending, permissionApproved);

    setTotalPermissionRequests(totalPermission);
    setPermissionPending(permissionPending);
    setPermissionApproved(permissionApproved);
    setPermissionDenied(
      totalPermission - permissionApproved - permissionPending
    );
  }, [leaveCardData, permissionCardData, selectedDepartmentMain, selectedUnit, selectedGender , selectedSubDepartment]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeInDept = (event) => {
    setSelectedDepartmentMain(event.target.value);
    setChangeInDept(!changeInDept);
  };

  const handleChangeInSubdept = (event) => {
    setSelectedSubDepartment(event.target.value);
    setChangeInSubDept(!changeInSubDept);
  };

  const handleChangeInGender = (event) => {
    setSelectedGender(event.target.value);
    setChangeInGender(!changeInGender);
  };

  const handleChangeInUnit = (event) => {
    console.log(event.target.value);
    setSelectedUnit(event.target.value);
    setChangeInUnit(!changeInUnit);
  };

  const filteredEmployees = empAll.filter(
    (employee) =>
      (employee.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.empId.includes(searchTerm)) &&
      (selectedDepartment === "" || employee.department === selectedDepartment)
  );

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  const handleClick = (index, id) => {
    setEmployeeId(id);
    // console.log("after clicking", index);
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
      <div className="flex flex-col w-screen h-screen ">
        <Nav
          setIsRequest={setIsRequest}
          setIsPermission={setIsPermission}
          setIsEmployees={setIsEmployees}
        />

        <div className="w-full h-full p-2 overflow-y-auto 0">
          {isEmployees ? (
            <div className="pt-5">
              <Details />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col lg:flex-row lg:justify-between lg:items-start">
              <div className="w-full lg:w-[75%] flex flex-col p-3 gap-3">
                <div className="w-full flex  gap-3 pb-5">
                  <div className="">
                    <select
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                      value={selectedDepartmentMain} // Bind the state to the select value
                      onChange={handleChangeInDept}
                    >
                      {departments.map((row) => (
                        <option key={row}>{row}</option>
                      ))}
                    </select>
                  </div>

                  <div className="">
                    <select
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                      value={selectedSubDepartment} // Bind the state to the select value
                      onChange={handleChangeInSubdept}
                    >
                      {subDepartments.map((row) => (
                        <option key={row}>{row}</option>
                      ))}
                    </select>
                  </div>

                  <div className="">
                    <select
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                      value={selectedGender} // Bind the state to the select value
                      onChange={handleChangeInGender}
                    >
                      {gender.map((row) => (
                        <option key={row}>{row}</option>
                      ))}
                    </select>
                  </div>

                  <div className="">
                    <select
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                      value={selectedUnit} // Bind the state to the select value
                      onChange={handleChangeInUnit}
                    >
                      {units.map((row) => (
                        <option key={row}>{row}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  {isRequest ? (
                    <div>
                      <div className="w-full h-fit p-3 rounded-lg">
                        <div className="flex flex-wrap justify-between gap-3">
                          <Card
                            label="Leaves Requested"
                            value={totalLeaveRequests}
                            color="#C6E7FF"
                          />
                          <Card
                            label="Leaves Pending"
                            value={leavesPending}
                            color="#FEEFAD"
                          />
                          <Card
                            label="Leave Approved"
                            value={leavesApproved}
                            color="#BFF6C3"
                          />
                          <Card
                            label="Leave Denied"
                            value={leavesDenied}
                            color="#FFB0B0"
                          />
                        </div>
                      </div>
                      <Table
                        leaveCardData={getLeaveCardData}
                        permissionCardData={getPermissionCardData}
                        department_={selectedDepartmentMain}
                        changeInDept={changeInDept}
                        unit = {selectedUnit}
                        changeInUnit = {changeInUnit}
                        gender = {selectedGender}
                        changeInGender = {changeInGender}
                        subDept = {selectedSubDepartment}
                        changeInSubDept = {changeInSubDept}
                        
                      />
                    </div>
                  ) : isPermission ? (
                    <div>
                      <div className="w-full h-fit p-3 rounded-lg">
                        <div className="flex flex-wrap justify-between gap-3">
                          <Card
                            label="Permission Requested"
                            value={totalPermissionRequests}
                            color="#C6E7FF"
                          />
                          <Card
                            label="Permission Pending"
                            value={permissionPending}
                            color="#FEEFAD"
                          />
                          <Card
                            label="Permission Approved"
                            value={permissionApproved}
                            color="#BFF6C3"
                          />
                          <Card
                            label="Permission Denied"
                            value={permissionDenied}
                            color="#FFB0B0"
                          />
                        </div>
                      </div>
                      <PermissionTable
                        permissionCardData={getPermissionCardData}
                        changeInDept={changeInDept}
                        department_={selectedDepartmentMain}
                        unit = {selectedUnit}
                        changeInUnit = {changeInUnit}
                        gender = {selectedGender}
                        changeInGender = {changeInGender}
                        subDept = {selectedSubDepartment}
                        changeInSubDept = {changeInSubDept}
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="w-full h-fit p-3 mb-5 rounded-lg">
                        <div className="flex flex-wrap justify-between gap-3">
                          <Card
                            label="Leaves Requested"
                            value={totalLeaveRequests}
                            color="#C6E7FF"
                          />
                          <Card
                            label="Leaves Pending"
                            value={leavesPending}
                            color="#FEEFAD"
                          />
                          <Card
                            label="Permission Requested"
                            value={totalPermissionRequests}
                            color="#C6E7FF"
                          />
                          <Card
                            label="Permission Pending"
                            value={permissionPending}
                            color="#FEEFAD"
                          />
                        </div>
                      </div>
                      <Charts
                        department_={selectedDepartmentMain}
                        changeInDept={changeInDept}
                        unit = {selectedUnit}
                        changeInUnit = {changeInUnit}
                        gender = {selectedGender}
                        changeInGender = {changeInGender}
                        subDept = {selectedSubDepartment}
                        changeInSubDept = {changeInSubDept}

                      />
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
                    className="w-full p-1 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 text-sm md:text-base"
                    placeholder="Search Employee"
                  />
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 w-[100%]"
                  >
                    <option value="">All Department</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Store">Store</option>
                    <option value="Quality">Quality</option>
                    <option value="Manufacturing Engineering">
                      Manufacturing Engineering
                    </option>
                    <option value="Facilities and Maintenance">
                      Facilities and Maintenance
                    </option>
                    <option value="Sourcing">Sourcing</option>
                    <option value="Planning">Planning</option>
                    <option value="Human Resource">Human Resource</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Finance">Finance</option>
                    <option value="EHS">EHS</option>
                    <option value="TACC Lab">TACC Lab</option>
                    <option value="Engineering">Engineering</option>
                  </select>
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
    <div
      className="w-full md:w-[48%] lg:w-[250px] h-auto flex flex-col items-center justify-center border-2 border-gray-600 text-white gap-2 rounded-xl p-3 bg-opacity-50 "
      style={{ backgroundColor: props.color }}
    >
      <div className="flex flex-row text-white">
        <p className="text-lg md:text-xl text-black font-medium">
          {props.label}
        </p>
      </div>
      <div className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black">
        <p>{props.value}</p>
      </div>
    </div>
  );
};
