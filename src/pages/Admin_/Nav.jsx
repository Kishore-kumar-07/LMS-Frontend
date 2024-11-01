import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import
import GVR from "../../images/GVRLogo.png";
import userImg from "../../images/profile.png";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaBars, FaTimes } from "react-icons/fa";

function Nav({ setIsManager, setIsEmployees }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Employees");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Employees");

  const handleClick = (section) => {
    setSelected(section);
    setIsMobileMenuOpen(false); 
    if (section === "Employees") {
      setIsManager(false);
      setIsEmployees(true);
    } else if (section === "Managers") {
      setIsManager(true);
      setIsEmployees(false);
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

        if (res.status === 401) {
          console.log("yes");
          navigate("/thank-you");
        }

        const userData = res.data[0];
        setUserDetails(userData);

       
      } catch (error) {
        if (error.response.status === 400) {
          navigate("/error404");
        }
        if (error.response.status === 500) {
          navigate("/error500");
        }
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, [empId, token, navigate]);

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    console.log("Logged out, cookie removed");
    navigate("/");
  };

  return (
    <>
      <div className="w-screen flex  items-center mb-5">
        <div
          style={{
            boxShadow:
              "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          className="w-[100%] flex justify-between items-center px-5 py-2 rounded-lg"
        >
          <div className="text-xl font-semibold cursor-pointer pl-10">
            <img src={GVR} alt="GVR Logo" width={120} height={80} />
          </div>
          <div className="block md:hidden flex justify-center items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>

          <div
            className={`flex gap-5 shadow rounded-md text-black md:flex justify-center items-center ${
              isMobileMenuOpen
                ? "flex-col absolute bg-white z-10 p-5  w-[50%]"
                : "hidden md:flex"
            }`}
          >
            {[ "Employees" , "Managers"].map(
              (section) => (
                <span
                  key={section}
                  onClick={() => {
                    handleClick(section);
                    setActiveNav(
                      section.charAt(0).toUpperCase() + section.slice(1)
                    ); 
                  }}
                  className={`px-4 py-2 cursor-pointer font-semibold text-lg transition-all duration-300 ease-in-out border-b-2 ${
                    activeNav ===
                    section.charAt(0).toUpperCase() + section.slice(1)
                      ? "text-[#015E84] border-[#015E84]"
                      : "text-black border-transparent"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}{" "}
                  
                </span>
              )
            )}
          </div>

          <div className="flex justify-around items-center relative pr-10 ">
            <button
              className="flex justify-center items-center"
              onClick={handleUserClick}
            >
              <img src={userImg} alt="User" className="h-10 " />
            </button>

            {isDropdownOpen && (
              <div className="absolute w-96 top-12 right-0 bg-white shadow-lg rounded-lg p-4 z-50">
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold">
                    {userDetails.empName || "Unknown User"}
                  </h1>
                  <table className="text-gray-700 mt-2 w-full break-words">
                    <tbody>
                      <tr>
                        <td className="font-semibold w-32">Designation:</td>
                        <td className="break-words">
                          {userDetails.designation || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-32">
                          Reporting Manager:
                        </td>
                        <td className="break-words">
                          {userDetails.manager || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-32">DOJ:</td>
                        <td>{userDetails.dateOfJoining || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-32">Function:</td>
                        <td className="break-words">
                          {userDetails.function || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-32">Department:</td>
                        <td className="break-words">
                          {userDetails.department || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-32">Band/Level:</td>
                        <td className="break-words">
                          {userDetails.level || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-32">Location:</td>
                        <td className="break-words">
                          {userDetails.location || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold w-32">Unit:</td>
                        <td className="break-words">
                          {userDetails.unit || "N/A"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dark background when dropdown is open */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
}

export default Nav;
