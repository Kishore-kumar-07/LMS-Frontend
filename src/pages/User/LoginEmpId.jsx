import React from "react";

function LoginEmpId() {
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
              EmpId
            </label>
            <input
              id="EmpId"
              onChange={(e) => {}}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 "
              placeholder="Enter your Employee Id"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-md font-bold pl-1 mb-4 text-gray-600"
            >
              Password
            </label>
            <input
              id="PassWord"
              onChange={(e) => {}}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 "
              placeholder="Enter your PassWord"
            />
          </div>

          <button
            onClick={() => {}}
            className={`bg-black hover:bg-gray-800 ml-36 mt-5 text-white font-bold py-2 px-4 rounded `}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginEmpId;
