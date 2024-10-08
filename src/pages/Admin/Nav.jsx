import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import GVR from '../../images/GVRLogo.png';
import userImg from '../../images/profile.png';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane } from "react-icons/fa";


function Nav({ setIsRequest, setIsPermission , setIsEmployees }) {
  const [selected, setSelected] = useState('dashboard');
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCircular, setIsCircular] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const token = document.cookie.split('=')[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [activeNav, setActiveNav] = useState('Dashboard');

  const handleClick = (section) => {
    setSelected(section);
    if (section === 'dashboard') {
      setIsRequest(false);
      setIsPermission(false);
      setIsEmployees(false);
    } else if (section === 'leaves') {
      setIsRequest(true);
      setIsPermission(false);
      setIsEmployees(false);

    } else if (section === 'permission') {
      setIsPermission(true);
      setIsRequest(false);
      setIsEmployees(false);

    } else if (section === 'Employees') {
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
              'Content-Type': 'application/json',
            },
          }
        );
        setUserDetails(res.data[0]);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    getUserDetails();
  }, [empId, token]);

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCircularClick = () =>{
    setIsCircular(!isCircular);
  }

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log('Logged out, cookie removed');
    navigate('/');
  };

  return (
    <>
      <div className="w-[100%] flex justify-center items-center">
        <div className="w-[100%] flex justify-between items-center px-10 py-2 shadow">
          <div className="text-xl font-semibold">
            <img src={GVR} alt="GVR Logo" className="h-10" />
          </div>
          <div>
            <ul className="flex gap-10 text-black">
              <li className="relative">
                <span
                  onClick={() => {
                    handleClick('dashboard');
                    setActiveNav('Dashboard');
                  }}
                  className={`px-4 py-2 cursor-pointer font-semibold text-lg transition-all duration-300 ease-in-out border-b-2 ${
                    activeNav === 'Dashboard'
                      ? 'text-[#015E84] border-[#015E84]'
                      : 'text-black border-transparent'
                  }`}
                >
                  Dashboard
                </span>
              </li>

              <li className="relative">
                <span
                  onClick={() => {
                    handleClick('leaves');
                    setActiveNav('Leaves');
                  }}
                  className={`px-4 py-2 cursor-pointer font-semibold text-lg transition-all duration-300 ease-in-out border-b-2 ${
                    activeNav === 'Leaves'
                      ? 'text-[#015E84] border-[#015E84]'
                      : 'text-black border-transparent'
                  }`}
                >
                  Leaves
                </span>
              </li>

              <li className="relative">
                <span
                  onClick={() => {
                    handleClick('permission');
                    setActiveNav('Permissions');
                  }}
                  className={`px-4 py-2 cursor-pointer font-semibold text-lg transition-all duration-300 ease-in-out border-b-2 ${
                    activeNav === 'Permissions'
                      ? 'text-[#015E84] border-[#015E84]'
                      : 'text-black border-transparent'
                  }`}
                >
                  Permissions
                </span>
              </li>

              <li className="relative">
                <span
                  onClick={() => {
                    handleClick('Employees');
                    setActiveNav('Employees');
                  }}
                  className={`px-4 py-2 cursor-pointer font-semibold text-lg transition-all duration-300 ease-in-out border-b-2 ${
                    activeNav === 'Employees'
                      ? 'text-[#015E84] border-[#015E84]'
                      : 'text-black border-transparent'
                  }`}
                >
                  Employees
                </span>
              </li>
            </ul>
          </div>
          <div className="flex ">
            
            <button
              className="flex justify-center items-center"
              onClick={handleUserClick}
            >
              <img src={userImg} alt="User" className="h-10" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 w-fit bg-white shadow-lg rounded-lg p-4 z-50">
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold">{userDetails.empName}</h1>
                  <table className="text-left text-gray-700 mt-2">
                    <tbody>
                      <tr>
                        <td className="font-semibold">Designation:</td>
                        <td>{userDetails.designation}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Reporting Manager:</td>
                        <td>{userDetails.reportionManager}</td>
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
