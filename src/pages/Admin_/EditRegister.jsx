import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { CURRENT_STATUS } from "../../statusIndicator";
import { ClockLoader } from "react-spinners";

function EditRegister({ setOpenEditModal , getEmployees , currentEmployee ,  filterManager }) {
  const [formData, setFormData] = useState({
    empName: "",
    empMail: "",
    empPhone: "",
    role: "",
    vendor: "",
    gender: "",
    manager: "",
    designation: "",
    reportingManager: "",
    function: "",
    department: "",
    level: "",
    location: "",
    unit: "",
  });

  const navigate = useNavigate();

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const adminId = decodedToken.empId;

  const [errors, setErrors] = useState({});
  const [isAdoption, setIsAdoption] = useState(false);
  const [isPaternity, setIsPaternity] = useState(false);

  const [manager, setManager] = useState([]);
  const [admin, setAdmin] = useState([]);

  const[isEdit,setIsEdit] = useState(CURRENT_STATUS.IDEAL);

  useEffect(() => {
    
    if (currentEmployee) {
      setFormData({
        empName: currentEmployee.empName || "",
        empMail: currentEmployee.empMail || "",
        empPhone: currentEmployee.empPhone || "",
        role: currentEmployee.role || "",
        vendor: currentEmployee.vendor || "",
        gender: currentEmployee.gender || "",
        manager: currentEmployee.manager || "",
        function: currentEmployee.function || "",
        department: currentEmployee.department || "",
        level: currentEmployee.level || "",
        location: currentEmployee.location || "",
        unit: currentEmployee.unit || "",
      });
      setIsAdoption(currentEmployee.isAdpt || false);
      setIsPaternity(currentEmployee.isPaternity || false);
    }
  }, [currentEmployee]);

  useEffect(() => {
    if(filterManager){
    const managerList = filterManager.filter((row) => row.role === "Manager");
    const adminList = filterManager.filter((row) => row.role === "Admin");
    setManager(managerList);
    setAdmin(adminList);
    }
  }, [filterManager]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const closeModal = () => {
    setOpenEditModal(false);
  };

  const handlePaternityChange = () => {
    setIsPaternity(!isPaternity);
  };

  const handleAdoptionChange = () => {
    setIsAdoption(!isAdoption);
  };


  const handleSubmit = async (e) => {
    console.log("edit submit")
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
        console.log("inside try")
        console.log(formData)
        console.log(adminId);
        console.log(currentEmployee.manager);
        setIsEdit(CURRENT_STATUS.LOADING);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/update`,
        {
            id : adminId,
            empId : currentEmployee.empId,
            empName: formData.empName,
            empMail: formData.empMail,
            empPhone: formData.empPhone,
            role: formData.role,
            vendor: formData.vendor,
            gender: formData.gender,
            managerId: currentEmployee.managerId  ,
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
      if(res.status === 200){
        console.log(res);
        setIsEdit(CURRENT_STATUS.SUCCESS);

      toast.success("User Updated Successfully");
      

      setTimeout(() => {
        setOpenEditModal(false);
      }, 2000);
      }
      getEmployees();

      
    } catch (error) {
      if(error.response.status === 400){
        navigate('/error404');
      }
      else if(error.response.status === 404){
        toast.error("employee not found");
        // navigate('/error404');
      }
      else if(error.response.status === 500){
        toast.error("Server Error");
        navigate('/error500');
      }
      setIsEdit(CURRENT_STATUS.ERROR);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-2 overflow-y-auto h-fit md:h-full">
      <ToastContainer/>
      <div className="w-full mb-10 flex justify-between">
        <p></p>
        <h1 className="text-3xl font-bold text-center text-blue-700 ">
          Employee Update Form
        </h1>
        <button
          className="pr-10 text-2xl font-semibold text-red-500"
          onClick={closeModal}
        >
          X
        </button>
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent  placeholder-gray-500 ${
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
                  <option value="Candor">Candor</option>
                    <option value="Sitics">Sitics</option>
                    <option value="Gilbarco">Gilbarco</option>
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
                    {formData.role === "Manager"
                      ? admin.map((admin) => (
                          <option key={admin.empId} value={admin.userName}>
                            {admin.empName}
                          </option>
                        ))
                      : manager.map((manager) => (
                          <option key={manager.empId} value={manager.userName}>
                            {manager.empName}
                          </option>
                        ))}
                  </>
                )}
              {key === "designation" && (
                <>
                  <option value="3P Employee">3P Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="GVR Employee">GVR Employee</option>
                </>
              )}
              {key === "function" && (
                  <>
                    <option value="Operations">Operations</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Commercial">Commercial</option>
                  </>
                )}
              {key === "department" && (
                  <>
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
                  <>
                    <option value="DTA">DTA</option>
                    <option value="EOU">EOU</option>
                    <option value="DTA/EOU">DTA/EOU</option>
                  </>
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent  placeholder-gray-500 ${
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

        <div>
        {formData.role === "GVR" && (
          <div className="flex flex-col gap-3 justify-center items-end ">
            <div className="flex gap-2">
            <label className="text-gray-700 font-semibold">
              Paternity Leave
            </label>
            <input
              type="checkbox"
              checked={isPaternity}
              onChange={handlePaternityChange}
              className="mt-2"
            />
            </div>
            <div className="flex gap-2">
            <label className="text-gray-700 font-semibold">
              Adoption Leave
            </label>
            <input
              type="checkbox"
              checked={isAdoption}
              onChange={handleAdoptionChange}
              className="mt-2"
            />
            </div>
          </div>
        )}
        </div>
        <div className="flex w-full justify-center items-center">
          {isEdit!==CURRENT_STATUS.LOADING?<button
            type="submit"
            className="w-[30%] bg-blue-500 text-white py-3 rounded-lg font-bold shadow-md hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-transform duration-200 col-span-1 md:col-span-3"
          >
            Submit
          </button>: <div className="flex justify-center mt-5">
                <ClockLoader color="#000000" size={30} />
              </div>}
        </div>
      </form>
      {/* <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
      /> */}
    </div>
  );
}

export default EditRegister;
