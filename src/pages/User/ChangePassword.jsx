
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClockLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { CURRENT_STATUS } from "../../statusIndicator";

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = useState("");
  const [reOldPass, setReOldPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showReOldPass, setShowReOldPass] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(CURRENT_STATUS.IDEAL);

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.userName;
  const empId = decodedToken.empId;
  

  const HideShowOldPass = () => {
    setShowOldPass(!showOldPass);
  };

  const HideShowReOldPass = () => {
    setShowReOldPass(!showReOldPass);
  };

  const verifyPass = async () => {
    if (oldPass !== reOldPass) {
      toast.warn("Password and retyped password is not matched");
      return;
    }
    try {
      setIsLoading(CURRENT_STATUS.LOADING);

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/checkPassword`,
        { empId: empId, password: oldPass },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Verified");
      if (res.status === 200) {
        setIsLoading(CURRENT_STATUS.SUCCESS);
        sendOtp();
      }
    } catch (e) {
    
      
      setIsLoading(CURRENT_STATUS.ERROR);
      if(e.status === 400){
        toast.error("Invalid password");
      }else{
        toast.error("Somthing Went Wrong");

      }
    }
  };

  const sendOtp = async () => {
    try {

      setIsLoading(CURRENT_STATUS.LOADING);

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/otp/send`,
        { userName: userName },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        setIsLoading(CURRENT_STATUS.IDEAL);

        setIsOtp(!isOtp);
        toast.success("Otp Sent");
      }
    } catch (e) {
      setIsLoading(CURRENT_STATUS.ERROR);
     
      toast.error("Otp Not Sent");
    }
  };

  const validateOtp = async () => {
    try {
     
      setIsLoading(CURRENT_STATUS.LOADING);

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/otp/verify`,
        { userName: userName, otp: otp },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        setIsLoading(CURRENT_STATUS.IDEAL);
        toast.success("Otp Is valid");
        navigate(`/reset-password/${userName}`);
      }
    } catch (e) {
      toast.error("Otp Is Not Valid");
      setIsLoading(CURRENT_STATUS.ERROR);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <ToastContainer />
      <div className="h-[60%] w-[50%] rounded-lg flex justify-center items-center bg-white shadow-lg">
        <div className="w-[60%] h-[80%] flex flex-col items-center justify-evenly">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Change Password
          </h1>

          <div className="relative w-[70%]">
            <input
              type={showOldPass ? "text" : "password"}
              value={oldPass}
              onChange={(e) => {
                setOldPass(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Old Password"
            />
            <label
            role="button"
              onClick={() => {
                setShowOldPass(!showOldPass);
              }}
              className="absolute inset-y-0 right-0 pr-3 
                    flex items-center 
                    cursor-pointer"
            >
              {showOldPass ? "Hide" : "Show"}
            </label>
          </div>

          <div className="relative w-[70%]">
            <input
              type={showReOldPass ? "text" : "password"}
              value={reOldPass}
              onChange={(e) => {
                setReOldPass(e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Re-Enter Old Password"
            />
            <label
            role="button"
              onClick={() => {
                setShowReOldPass(!showReOldPass);
              }}
              className="absolute inset-y-0 right-0 pr-3 
                    flex items-center 
                    cursor-pointer"
            >
              {showReOldPass ? "Hide" : "Show"}
            </label>
          </div>

          {isOtp && (
            <input
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              className="w-[70%] px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Otp"
            />
          )}

          {isLoading !== CURRENT_STATUS.LOADING ? (
            <button
              className=" bg-blue-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-blue-600 transition duration-200"
              onClick={isOtp ? validateOtp : verifyPass}
            >
              {isOtp ? "Validate Otp" : "Verify"}
            </button>
          ) : (
            <div className="flex justify-center items-center mt-5">
              <ClockLoader color="#000000" size={30} />
            </div>
          )}
          <button
            className="self-start bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-4 w-[20%]"
            onClick={() => navigate(-1)}
          >
            back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
