import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import GVR from '../../images/GVRLogo.png';
import userImg from '../../images/profile.png';
import { useNavigate } from 'react-router-dom';
import NotificationButton from './NotificationButton';

function Nav({setOption}) {

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const token = document.cookie.split('=')[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/emp/getEmp`, { empId }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if(res.status === 401){
          console.log("yes")
          navigate('/thank-you')
        }

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

    // Implement logout functionality here
    const handleLogout = () => {
      // Remove the JWT cookie by setting its expiration date to a past date
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log('Logged out, cookie removed');
      navigate("/");
  };

  return (
    <>
      <div className='w-full flex justify-center items-center mb-5'>
        <div
          style={{ boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
          className='w-[100%] flex justify-between items-center px-5 py-2 rounded-lg'>
          <div onClick={() => setOption("Home")} className='text-xl font-semibold cursor-pointer'>
            <img src={GVR} alt="GVR Logo" className='h-10' />
          </div>
          <div className='flex w-56 justify-around items-center relative mr-10'> {/* Added relative positioning here */}
            <NotificationButton />
            <button className='flex justify-center items-center' onClick={handleUserClick}>
              <img src={userImg} alt="User" className='h-10 ' />
            </button>
            {isDropdownOpen && (
              <div className='absolute w-96 top-12 right-0 bg-white shadow-lg rounded-lg p-4 z-50'>
                {/* Adjusted top to move it below the button */}
                <div className='flex flex-col'>
                  <h1 className='text-xl font-bold'>{userDetails.empName}</h1>
                  <table className='text-gray-700 mt-2 w-full break-words'>
                    <tbody>
                      <tr>
                        <td className='font-semibold w-32'>Designation:</td>
                        <td className='break-words'>{userDetails.designation}</td>
                      </tr>
                      <tr>
                        <td className='font-semibold w-32'>Reporting Manager:</td>
                        <td className='break-words'>{userDetails.manager}</td>
                      </tr>
                      <tr>
                        <td className='font-semibold w-32'>DOJ:</td>
                        <td>{userDetails.dateOfJoining}</td>
                      </tr>
                      <tr>
                        <td className='font-semibold w-32'>Function:</td>
                        <td className='break-words'>{userDetails.function}</td>
                      </tr>
                      <tr>
                        <td className='font-semibold w-32'>Department:</td>
                        <td className='break-words'>{userDetails.department}</td>
                      </tr>
                      <tr>
                        <td className='font-semibold w-32'>Band/Level:</td>
                        <td className='break-words'>{userDetails.level}</td>
                      </tr>
                      <tr>
                        <td className='font-semibold w-32'>Location:</td>
                        <td className='break-words'>{userDetails.location}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className='mt-4 bg-red-500 text-white px-4 py-2 rounded-lg'
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
          className='fixed inset-0 bg-black opacity-50'
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </>
  );
}

export default Nav;
