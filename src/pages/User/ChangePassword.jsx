import { Password } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = useState("");
  const [reOldPass, setReOldPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showReOldPass, setShowReOldPass] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
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
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/checkPassword`,
        { empId: decodedToken.empId, password: oldPass },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Verified");
      if (res.status === 200) {
        sendOtp();
      }
    } catch (e) {
      console.log(e);
      console.log(decodedToken.empId);

      toast.error("Wrong");
    }
  };

  const sendOtp = async () => {
    try {
      console.log("inside try");

      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/otp/send`,
        { userName: "24Gilbarco003" },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        setIsOtp(!isOtp);
        toast.success("Otp Sent");
      }
    } catch (e) {
      console.log(e);
      toast.error("Wrong Opt");
    }
  };

  const validateOtp = async () => {
    try {
      console.log("otp is ", otp);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/otp/verify`,
        { userName: "24Gilbarco003", otp: otp },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        toast.success("Otp Is valid");
        navigate(`/reset-password/24Gilbarco003`);
      }
    } catch (e) {
      toast.error("Otp Is Not Valid");
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

          <button
            className=" bg-blue-500 text-white font-bold py-2 px-4 rounded w-[30%] hover:bg-blue-600 transition duration-200"
            onClick={isOtp ? validateOtp : verifyPass}
          >
            {isOtp ? "Validate Otp" : "Verify"}
          </button>
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
