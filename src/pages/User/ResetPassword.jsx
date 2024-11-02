import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setNewRePassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (newPassword !== newRePassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/emp/forgetPassword`,
                { 
                    userName: "Lingesh",
                    password: newPassword 
                },
                { headers: { "Content-Type": "application/json" } }
            );
            if (res.status === 200) {
                navigate("/login");
            } else {
                setError("An error occurred while resetting the password");
            }
        } catch (e) {
            setError("Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>
                <p className="text-gray-600 text-center mt-2 mb-6">Enter a new password for your account</p>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block text-md font-bold mb-2 text-gray-600">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Enter new password"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-md font-bold mb-2 text-gray-600">Retype New Password</label>
                    <input
                        type="password"
                        value={newRePassword}
                        onChange={(e) => setNewRePassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="Retype new password"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-600 transition duration-200"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
