import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { CURRENT_STATUS } from "../../statusIndicator";
import { ClockLoader } from "react-spinners";
import { toast } from "react-toastify";

function Loginotp() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [errorotp, setErrorOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [sendStatus, setSendStatus] = useState(CURRENT_STATUS.IDEAL);
  const [validateStatus, setValidateStatus] = useState(CURRENT_STATUS.IDEAL);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState(CURRENT_STATUS.IDEAL);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isOtpSent) {
      clearInterval(interval);
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const sendOtp = async () => {
    try {
      
      setSendStatus(CURRENT_STATUS.LOADING);
      if (userName.length != "") {
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/otp/send`,
          { userName: userName },
          { headers: { "Content-Type": "application/json" } }
        );
        if (res.status === 200) {
          setSendStatus(CURRENT_STATUS.SUCCESS);
          setError("");
          setIsOtpSent(true);
          setTimer(60);
          setIsResendDisabled(true);
        }
      } else {
        setSendStatus(CURRENT_STATUS.IDEAL);
        setError("Please enter a valid Username");
      }
    } catch (e) {
      setSendStatus(CURRENT_STATUS.ERROR);
      setError("Failed to send OTP");
    }
  };

  const validateOtp = async () => {
    try {
      
      setValidateStatus(CURRENT_STATUS.LOADING);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/otp/verify`,
        { userName: userName, otp: otp },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        setValidateStatus(CURRENT_STATUS.SUCCESS);
        setError("");

        navigate(`/reset-password/${userName}`);
      } else if(res.status === 401){
        setValidateStatus(CURRENT_STATUS.IDEAL);
        setErrorOtp("Incorrect OTP");
      }
      else{
        setError("Failed to validate OTP");
      }
    } catch (e) {
      setValidateStatus(CURRENT_STATUS.ERROR);
      setErrorOtp("Failed to validate OTP");
    }
  };

  const handleLogin = async () => {
    if (!userName || !password) {
      setError("Username and password are required.");
      return;
    }
    try {
      setLoginStatus(CURRENT_STATUS.LOADING);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/signin`,
        { userName, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        setLoginStatus(CURRENT_STATUS.SUCCESS);
        document.cookie = `token=${res.data.token}`;
        const decodedToken = jwtDecode(res.data.token);
        navigate(
          decodedToken.role === "Manager"
            ? "/Manager"
            : decodedToken.role === "Admin"
            ? "/Admin"
            : "/Employee"
        );

      } else if(res.status === 400 || res.status === 404) {
        setValidateStatus(CURRENT_STATUS.IDEAL);

        setError("Invalid Username or Password");
      }
    } catch (e) {
      setLoginStatus(CURRENT_STATUS.ERROR);
      setError("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isForgetPassword ? "Forget Password" : "Login"}
        </h2>
        {isForgetPassword ? (
          <div className="mt-6">
            <label className="block text-md font-bold mb-2 text-gray-600">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter Username"
            />
            {isOtpSent && (
              <>
                <label className="block text-md font-bold mt-4 mb-2 text-gray-600">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter OTP"
                />
              </>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {sendStatus !== CURRENT_STATUS.LOADING ? (
              <button
                onClick={sendOtp}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 w-full"
              >
                {isOtpSent ? "Resend OTP" : "Send OTP"}
              </button>
            ) : (
              <div className="flex justify-center mt-5">
                <ClockLoader color="#000000" size={30} />
              </div>
            )}
            {isOtpSent &&
              (validateStatus !== CURRENT_STATUS.LOADING ? (
                <button
                  onClick={validateOtp}
                  className="bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                >
                  Validate OTP
                </button>
              ) : (
                <div className="flex justify-center mt-5">
                  <ClockLoader color="#000000" size={30} />
                </div>
              ))}
            <button
              onClick={() => setIsForgetPassword(false)}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-4 w-[20%]"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <label className="block text-md font-bold mb-2 text-gray-600">
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your Username"
            />
            <label className="block text-md font-bold mt-4 mb-2 text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {loginStatus !== CURRENT_STATUS.LOADING ? (
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 w-full"
              >
                Login
              </button>
            ) : (
              <div className="flex justify-center mt-5">
                <ClockLoader color="#000000" size={30} />
              </div>
            )}
            <p
              className="cursor-pointer mt-4 text-center text-blue-500"
              onClick={() => setIsForgetPassword(true)}
            >
              Forgot Password?
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded mt-4 w-[20%]"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Loginotp;
