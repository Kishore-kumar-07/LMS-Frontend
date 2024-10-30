import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import
import GVR from "../../images/GVRLogo.png";
import userImg from "../../images/profile.png";
import { useNavigate } from "react-router-dom";
import NotificationButton from "./NotificationButton";
import Candor from "../../images/Candor.png";
import Sitics from "../../images/Sitics.png";
import Teamlease from "../../images/Teamlease.png";
import YSF_2 from "../../images/YSF_2.png";

function Nav({ setOption }) {
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [logo, setLogo] = useState(); // Default logo set to GVR
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

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

        // Dynamically set the logo based on user details or another field
        if (userData.vendor === "Candor") {
          setLogo(Candor);
        } else if (userData.vendor === "Sitics") {
          setLogo(Sitics);
        } else if (userData.vendor === "Teamlease") {
          setLogo(Teamlease);
        } else if (userData.vendor === "YSF_2") {
          setLogo(YSF_2);
        }
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
          {/* Dynamic Logo Rendering */}
          <div
            onClick={() => setOption("Home")}
            className="text-xl font-semibold cursor-pointer pl-10"
          >
            <img src={logo} alt="Company Logo" width={60} height={40} />
          </div>

          <div className="flex w-56 justify-around items-center relative ">
            {/* <NotificationButton /> */}
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
