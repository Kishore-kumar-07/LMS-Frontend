import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function LogOutPopOut({ onClose }) {
  const [time, setTime] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          clearInterval(interval);
          navigate("/thank-you");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/40 z-50">
      <div className="h-[50%] w-[40%] bg-slate-200 px-20 py-14 rounded-lg shadow-2xl">
        <div className="flex flex-col h-full justify-around items-center">
          <h1 className="text-[1.8em] font-bold font-sans">
            Are You Sure You Want To Logout?
          </h1>

          <p className="text-xl font-semibold">{time}s</p>

          <div className="flex flex-row justify-around w-full">
            <button
              className="px-10 py-2 bg-green-400 shadow-lg rounded-md"
              onClick={() => navigate("/thank-you")}
            >
              Yes
            </button>
            <button
              className="px-10 py-2 bg-red-400 shadow-lg rounded-md"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

LogOutPopOut.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LogOutPopOut;
