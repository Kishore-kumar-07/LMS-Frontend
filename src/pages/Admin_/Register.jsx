import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { CURRENT_STATUS } from "../../statusIndicator";
import { ClockLoader } from "react-spinners";

function Register({ setOpenRegisterModal, getEmployees, filterManager }) {
  const [formData, setFormData] = useState({
    empId: "",
    empName: "",
    empMail: "",
    empPhone: "",
    role: "",
    vendor: "",
    gender: "",
    manager: "",
    dateOfJoining: "",
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

  const [isRegister , setIsRegister] = useState(CURRENT_STATUS.IDEAL);

  useEffect(() => {
    console.log(filterManager);
    const managerList = filterManager.filter((row) => row.role === "Manager");
    const adminList = filterManager.filter((row) => row.role === "Admin");
    setManager(managerList);
    setAdmin(adminList);
  }, [filterManager]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });

    // Reset adoption and paternity states if the role changes
    if (e.target.name === "role") {
      setIsAdoption(false);
      setIsPaternity(false);
    }
  };

  const closeModal = () => {
    setOpenRegisterModal(false);
    getEmployees();
  };

  const handlePaternityChange = () => {
    setIsPaternity(!isPaternity);
  };

  const handleAdoptionChange = () => {
    setIsAdoption(!isAdoption);
  };

  const formattedDateOfJoining = new Date(formData.dateOfJoining);
  const day = String(formattedDateOfJoining.getDate()).padStart(2, '0');
  const month = String(formattedDateOfJoining.getMonth() + 1).padStart(2, '0');
  const year = formattedDateOfJoining.getFullYear();
  
  const dateOfJoiningFormatted = `${day}-${month}-${year}`;

  const handleSubmit = async (e) => {
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
      setIsRegister(CURRENT_STATUS.LOADING);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/register`,
        {
          id: adminId,
          empId: formData.empId,
          empName: formData.empName,
          empMail: formData.empMail,
          empPhone: formData.empPhone,
          role: formData.role,
          vendor: formData.vendor,
          gender: formData.gender,
          managerId: formData.manager,
          dateOfJoining: dateOfJoiningFormatted,
          function: formData.function,
          department: formData.department,
          level: formData.level,
          location: formData.location,
          unit: formData.unit,
          isAdpt: isAdoption,
          isPaternity: isPaternity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        closeModal();
        toast.success("User Registered Successfully");
        setIsRegister(CURRENT_STATUS.SUCCESS);

        getEmployees();
      } else if (res.status === 404) {
        toast.error("Employee not Found");
      } else if (res.status === 402) {
        toast.error("Manager not Found");
      } else if (res.status === 400) {
        toast.error("Employee already exists");
      }
    } catch (error) {
      console.error("Error occurred:", error);

      if (error.response && error.response.status) {
        const { status } = error.response;
        if (status === 404) {
          toast.error("Employee not Found");
        } else if (status === 402) {
          toast.error("Manager not Found");
        } else if (status === 400) {
          toast.error("Employee already exists");
        }
        setIsRegister(CURRENT_STATUS.ERROR);

      }
    }
  };

  return (
    <div className="w-full bg-white rounded-lg p-5 overflow-y-auto h-fit md:h-full">
      <ToastContainer autoClose={5000} />
      <div className="w-full mb-10 flex justify-between">
        <p></p>
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Employee Data Form
        </h1>
        <button
          className="pr-10 text-2xl font-semibold text-red-500"
          onClick={closeModal}
        >
          X
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
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
              "Date of Joining",
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
                {key === "dateOfJoining" && (
                  <input
                    type="date"
                    id={key}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                      errors[key] ? "border-red-500" : ""
                    }`}
                  />
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
                  <option value="DTA">DTA</option>
                  <option value="EOU">EOU</option>
                  <option value="DTA/EOU">DTA/EOU</option>
                </>

                )}
              </select>
            ) : key === "dateOfJoining" ? (
              <input
                type="date"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent ${
                  errors[key] ? "border-red-500" : ""
                }`}
              />
            ) : (
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter ${key}`}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent  placeholder-gray-500 ${
                  errors[key] ? "border-red-500" : ""
                }`}
              />
            )}
            {errors[key] && (
              <p className="text-red-500 text-sm">{errors[key]}</p>
            )}
          </div>
        ))}

        {formData.role === "GVR" && (
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold">
              Paternity Leave
            </label>
            <input
              type="checkbox"
              checked={isPaternity}
              onChange={handlePaternityChange}
              className="mt-2"
            />
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
        )}

        <div className="col-span-1 md:col-span-3 flex justify-center mt-5">
         {isRegister!==CURRENT_STATUS.LOADING? <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>: <div className="flex justify-center mt-5">
                <ClockLoader color="#000000" size={30} />
              </div>}
        </div>
      </form>
    </div>
  );
}

export default Register;
