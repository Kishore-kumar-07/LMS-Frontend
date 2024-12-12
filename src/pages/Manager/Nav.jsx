import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import GVR from "../../images/GVRLogo.png";
import userImg from "../../images/profile.png";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";
import PropTypes from 'prop-types';
function Nav({ setIsRequest, setIsPermission, setIsEmployees }) {
  Nav.propTypes = {
    setIsRequest: PropTypes.func.isRequired,    
    setIsPermission: PropTypes.func.isRequired,  
    setIsEmployees: PropTypes.func.isRequired,
  };

  const [selected, setSelected] = useState("dashboard");
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [activeNav, setActiveNav] = useState("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = (section) => {
    setSelected(section);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
    if (section === "dashboard") {
      setIsRequest(false);
      setIsPermission(false);
      setIsEmployees(false);
    } else if (section === "leaves") {
      setIsRequest(true);
      setIsPermission(false);
      setIsEmployees(false);
    } else if (section === "permission") {
      setIsPermission(true);
      setIsRequest(false);
      setIsEmployees(false);
    } else if (section === "Employees") {
      setIsPermission(false);
      setIsRequest(false);
      setIsEmployees(true);
    }
  };

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
        setUserDetails(res.data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, [empId, token]);

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
 
    navigate("/");
  };

  const handleChange = () => {
    navigate("/ChangePassword");
  };

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="w-full flex justify-between items-center px-10 py-2 shadow">
          <div className="text-xl font-semibold">
            <img src={GVR} alt="GVR Logo" className="h-10" />
          </div>

          <div className="block md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>

          <div
            className={`flex gap-10 text-black md:flex ${
              isMobileMenuOpen
                ? "flex-col absolute bg-white z-10 p-5 right-0 w-full"
                : "hidden md:flex"
            }`}
          >
            {["dashboard", "leaves", "permission", "Employees"].map(
              (section) => (
                <span
                role="button"
                  key={section}
                  onClick={() => {
                    handleClick(section);
                    setActiveNav(
                      section.charAt(0).toUpperCase() + section.slice(1)
                    ); // Capitalize section name
                  }}
                  className={`px-4 py-2 cursor-pointer font-semibold text-lg transition-all duration-300 ease-in-out border-b-2 ${
                    activeNav ===
                    section.charAt(0).toUpperCase() + section.slice(1)
                      ? "text-[#015E84] border-[#015E84]"
                      : "text-black border-transparent"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}{" "}
                  {/* Display section name */}
                </span>
              )
            )}
          </div>

          <div className="flex">
            <button
              className="flex justify-center items-center"
              onClick={handleUserClick}
            >
              <img src={userImg} alt="User" className="h-10" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-2 top-14 w-fit bg-gray-100 shadow-lg shadow-left-bottom  shadow-gray border-black border-2 rounded-lg p-4 z-50">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold">{userDetails.empName}</h1>
                  <table className="text-left text-gray-700 mt-2">
                    <tbody>
                      <tr>
                        <th> </th>
                        <th> </th>
                      </tr>
                      <tr>
                        <td className="font-semibold">Designation:</td>
                        <td>{userDetails.role}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Reporting Manager:</td>
                        <td>{userDetails.reportingManager}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">DOJ:</td>
                        <td>{userDetails.dateOfJoining}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Function:</td>
                        <td>{userDetails.function}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Department:</td>
                        <td>{userDetails.department}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Band/Level:</td>
                        <td>{userDetails.level}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Location:</td>
                        <td>{userDetails.location}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="w-full flex justify-around gap-2">
                    <button
                      className="w-[50%] mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>

                    <button
                      className="w-[50%] mt-4 text-blue-500  px-4 py-2 rounded-lg"
                      onClick={handleChange}
                    >
                      <u>Change Password</u>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isDropdownOpen && (
        <div
        role="button"
          className="fixed inset-0 "
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
}

export default Nav;
