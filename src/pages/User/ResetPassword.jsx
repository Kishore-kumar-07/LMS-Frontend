import React, { useId, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CURRENT_STATUS } from "../../statusIndicator";
import { ClockLoader } from "react-spinners";

const ResetPassword = () => {
  const navigate = useNavigate();
  const {userId} = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [newRePassword, setNewRePassword] = useState("");
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState(CURRENT_STATUS.IDEAL);
  const handleSubmit = async () => {
    if (newPassword !== newRePassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setSubmitStatus(CURRENT_STATUS.LOADING);
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/forgetPassword`,
        {
          userName: userId,
          password: newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200) {
        setSubmitStatus(CURRENT_STATUS.SUCCESS);
        navigate("/login");
      } else {
        setSubmitStatus(CURRENT_STATUS.ERROR);
        setError("An error occurred while resetting the password");
      }
    } catch (e) {
      setSubmitStatus(CURRENT_STATUS.ERROR);
      setError("Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mt-2 mb-6">
          Enter a new password for your account
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="new pass" className="block text-md font-bold mb-2 text-gray-600">
            New Password
          </label>
          <input
          id="new pass"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-4">
          <label htmlFor = "retype_pass" className="block text-md font-bold mb-2 text-gray-600">
            Retype New Password
          </label>
          <input
          id="retype_pass"
            type="password"
            value={newRePassword}
            onChange={(e) => setNewRePassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Retype new password"
          />
        </div>

        {submitStatus !== CURRENT_STATUS.LOADING ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        ) : (
          <div className="flex justify-center mt-5">
            <ClockLoader color="#000000" size={30} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
