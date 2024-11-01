import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

function Register({setOpenRegisterModal , currentEmployee}) {
  const [formData, setFormData] = useState({
    empId: "",
    userName: "",
    password: "",
    empName: "",
    empMail: "",
    empPhone: "",
    role: "",
    vendor: "",
    gender: "",
    manager: "",
    designation: "",
    reportingManager: "",
    dateOfJoining: "",
    function: "",
    department: "",
    level: "",
    location: "",
    unit: "",
    isAdpt : false,
    isPaternity : false


  });

  useEffect(() => {
    if (currentEmployee) {
      setFormData({
            empId: formData.empId,
            userName: currentEmployee.userName || "" ,
            password: currentEmployee.password || "",
            empName: currentEmployee.empName || "",
            empMail: currentEmployee.empMail || "",
            empPhone: currentEmployee.empPhone || "",
            role: currentEmployee.role || "",
            vendor: currentEmployee.vendor || "",
            gender: currentEmployee.gender || "",
            manager: currentEmployee.manager || "" ,
            designation: currentEmployee.designation || "",
            reportingManager: currentEmployee.reportingManager || "",
            dateOfJoining: currentEmployee.dateOfJoining || "",
            function:currentEmployee.function || "",
            department: currentEmployee.department || "",
            level: currentEmployee.level || "",
            location: currentEmployee.location || "",
            unit: currentEmployee.unit || "",
            
      });
    }
  }, [currentEmployee]);

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const adminId = decodedToken.empId;

  const [errors, setErrors] = useState({});
  const [isAdoption, setIsAdoption] = useState(false);
  const [isPaternity, setIsPaternity] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const closeModal = () =>{
    setOpenRegisterModal(false);
  }

  const handlePaternityChange = () =>{
    setIsPaternity(!isPaternity);
  }

  const handleAdoptionChange = () =>{
    setIsAdoption(!isAdoption);
  }

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    const newErrors = {};

    
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/emp/register`,
          {
            id : adminId,
            empId: formData.empId,
            userName: formData.userName ,
            password: formData.password ,
            empName: formData.empName,
            empMail: formData.empMail,
            empPhone: formData.empPhone,
            role: formData.role,
            vendor: formData.vendor,
            gender: formData.gender,
            manager: formData.manager ,
            designation: formData.designation,
            reportingManager: formData.reportingManager,
            dateOfJoining: formData.dateOfJoining,
            function:formData.function,
            department: formData.department,
            level: formData.level,
            location: formData.location,
            unit: formData.unit,
            isAdpt : isAdoption,
            isPaternity : isPaternity

        },
          {
            headers: {
              Authorization: `Bearer ${token}`,             
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res)
        toast.success("User Registered Successfully")
        setOpenRegisterModal(false);

      } catch (error) {
        toast.error("Error in Registering User ")
       
        console.log(error);
      }
  };

  return (

    <div className="w-full bg-white rounded-lg p-2 overflow-y-auto h-fit md:h-full">
      <div className="w-full mb-10 flex justify-between">
        <p></p>
        <h1 className="text-3xl font-bold text-center text-blue-700 ">
        Employee Data Form
        </h1>
        <button className="pr-10 text-2xl font-semibold text-red-500" onClick={closeModal}>X</button>
      </div>
    
    
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.keys(formData).map((key) => (
        <div key={key} className="flex flex-col">
          <label
            htmlFor={key}
            className="text-gray-700 font-semibold capitalize"
          >
            {key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </label>
          {[
            "role",
            "vendor",
            "gender",
            "manager",
            "designation",
            "function",
            "department",
            "level",
            "location",
            "unit",
          ].includes(key) ? (
            <select
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 placeholder-gray-500 ${
                errors[key] ? "border-red-500" : ""
              }`}
            >
              <option value="">Select {key}</option>
              {key === "role" && (
                <>
                  <option value="Manager">Manager</option>
                  <option value="3P">3P</option>
                  <option value="GVR">GVR</option>
                </>
              )}
              {key === "vendor" && (
                <>
                  <option value="YSF_1">YSF_1</option>
                  <option value="YSF_2">YSF_2</option>
                </>
              )}
              {key === "gender" && (
                <>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </>
              )}
              {key === "manager" && (
                <>
                  <option value="Lingeshwaran">Lingeshwaran</option>
                  <option value="Another Manager">Another Manager</option>
                </>
              )}
              {key === "designation" && (
                <>
                  <option value="3P Employee">3P Employee</option>
                  <option value="Full-Time Employee">Full-Time Employee</option>
                  <option value="GVR Employee">GVR Employee</option>
                </>
              )}
              {key === "function" && (
                <>
                  <option value="Operations">Operations</option>
                  <option value="Engineering">Engineering</option>
                </>
              )}
              {key === "department" && (
                <>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="Mechanical">Mechanical</option>
                </>
              )}
              {key === "level" && (
                <>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </>
              )}
              {key === "location" && (
                <>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Chennai">Chennai</option>
                </>
              )}
              {key === "unit" && (
                <>
                  <option value="DTA">DTA</option>
                  <option value="STP">STP</option>
                </>
              )}
             
            </select>
          ) : (
            <input
              type={key === "password" ? "password" : "text"}
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50 placeholder-gray-500 ${
                errors[key] ? "border-red-500" : ""
              }`}
              placeholder={`Enter ${key}`}
            />
          )}

          {errors[key] && (
            <span className="text-red-500 text-sm font-medium">
              {errors[key]}
            </span>
          )}
        </div>
      ))}
      <div >

      </div>
      <div className="flex w-full justify-center items-center">
      <button
        type="submit"
        className="w-[50%] bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-transform duration-200 col-span-1 md:col-span-3"
      >
        Submit
      </button>
      </div>
      <div>
        <label>adoption </label>
        <input type="checkbox" onChange={handleAdoptionChange}></input>
        <label>paternity </label>
        <input type="checkbox" onChange={handlePaternityChange}></input>
      </div>
    </form>
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
    />
  </div>
    
  );
}

export default Register;