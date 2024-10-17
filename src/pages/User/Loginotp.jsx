import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { CURRENT_STATUS } from "../../statusIndicator";
import { ClockLoader } from "react-spinners";
function Loginotp() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [errorotp, setErrorOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [sendStatus, setSendStatus] = useState(CURRENT_STATUS.IDEAL);
  const [validateStatus, setValidateStatus] = useState(CURRENT_STATUS.IDEAL);
  const [resendStatus, setResendStatus] = useState(CURRENT_STATUS.IDEAL);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isOtpSent) {
      clearInterval(interval);
      setIsResendDisabled(false); // Enable the "Resend OTP" button when timer runs out
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const sendOtp = async () => {
    try {
      if (isOtpSent) {
        setResendStatus(CURRENT_STATUS.LOADING);
      } else {
        setSendStatus(CURRENT_STATUS.LOADING);
      }
      const Number = phoneNumber.toString();
      if (Number.length === 10) {
        const finalnumber = "+91" + Number;
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/otp/send`,
          {
            number: finalnumber,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          if (isOtpSent) {
            setResendStatus(CURRENT_STATUS.SUCCESS);
          } else {
            setSendStatus(CURRENT_STATUS.SUCCESS);
          }
          setError("");
          setIsOtpSent(true);
          setTimer(60);
          setIsResendDisabled(true); // Disable resend button after OTP is sent
        }
        console.log(res);
      } else {
        if (isOtpSent) {
          setResendStatus(CURRENT_STATUS.IDEAL);
        } else {
          setSendStatus(CURRENT_STATUS.IDEAL);
        }
        setError("Please enter a valid 10-digit phone number");
        console.log("error");
      }
    } catch (e) {
      if (e.response.status === 400) {
        navigate("/error404");
      }
      if (e.response.status === 500) {
        navigate("/error500");
      }
      if (isOtpSent) {
        setResendStatus(CURRENT_STATUS.ERROR);
      } else {
        setSendStatus(CURRENT_STATUS.ERROR);
      }
      setError("Failed to send OTP");
      console.log(e);
    }
  };

  const validateOtp = async () => {
    try {
      setValidateStatus(CURRENT_STATUS.LOADING);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/otp/verify`,
        {
          number: "+91" + phoneNumber,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.status === 200) {
        setValidateStatus(CURRENT_STATUS.SUCCESS);
        document.cookie = `token=${res.data.token}`;
        console.log(document.cookie);

        const decodedToken = jwtDecode(res.data.token);
        console.log("decoded", decodedToken);

        if (decodedToken.role === "Manager") {
          navigate("/Admin"); // Redirect to admin page
        } else {
          navigate(`/Employee`); // Redirect to employee page with ID
        }
      } else if (res.status === 401) {
        setValidateStatus(CURRENT_STATUS.IDEAL);
        setErrorOtp("Incorrect OTP");
      }
    } catch (e) {
      if (e.response.status === 400) {
        navigate("/error404");
      }
      if (e.response.status === 500) {
        navigate("/error500");
      }
      setValidateStatus(CURRENT_STATUS.ERROR);
      setErrorOtp("Incorrect OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md luxury-border">
        <h2 className="text-3xl font-bold text-center text-gray-800 luxury-text">
          Login
        </h2>
        <div className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-md font-bold pl-1 mb-4 text-gray-600"
            >
              Phone Number
            </label>
            <input
              type="number"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 "
              placeholder="Enter your phone number"
              disabled={isOtpSent} // Disable phone number field after OTP is sent
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {sendStatus === CURRENT_STATUS.IDEAL ? (
              <button
                onClick={sendOtp}
                className="bg-black hover:bg-gray-800 ml-36 mt-5 text-white font-bold py-2 px-4 rounded"
              >
                Send OTP
              </button>
            ) : sendStatus === CURRENT_STATUS.LOADING && !isOtpSent ? (
              <div className="w-full flex justify-center items-center mt-5">
                <ClockLoader
                  color="#000000"
                  cssOverride={{}}
                  size={30}
                  speedMultiplier={1}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          {isOtpSent && (
            <div>
              <label
                htmlFor="otp"
                className="block text-md font-bold pl-1 mb-4 text-gray-600"
              >
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-primary focus:border-luxury-secondary"
                placeholder="Enter OTP"
              />
              <div className="mt-4 flex justify-between items-center">
                {validateStatus === CURRENT_STATUS.IDEAL ? (
                  <button
                    onClick={validateOtp}
                    className="w-36 ml-32 bg-black text-white py-2 rounded-lg hover:bg-luxury-secondary transition"
                  >
                    Validate OTP
                  </button>
                ) : validateStatus === CURRENT_STATUS.LOADING ? (
                  <div className="w-full flex justify-center items-center mt-5">
                    <ClockLoader
                      color="#000000"
                      cssOverride={{}}
                      size={30}
                      speedMultiplier={1}
                    />
                  </div>
                ) : (
                  ""
                )}
                <p className="text-sm text-gray-600 mt-2 ml-1">
                  Time left: {timer}s
                </p>
              </div>

              {errorotp && (
                <p className="text-red-500 text-sm relative">{errorotp}</p>
              )}

              {timer === 0 && resendStatus === CURRENT_STATUS.IDEAL ? (
                <button
                  onClick={sendOtp}
                  className={`bg-black hover:bg-gray-800 ml-36 mt-5 text-white font-bold py-2 px-4 rounded ${
                    isResendDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isResendDisabled}
                >
                  Resend OTP
                </button>
              ) : resendStatus === CURRENT_STATUS.LOADING && isOtpSent ? (
                <div className="w-full flex justify-center items-center mt-5">
                  <ClockLoader
                    color="#000000"
                    cssOverride={{}}
                    size={30}
                    speedMultiplier={1}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Loginotp;
