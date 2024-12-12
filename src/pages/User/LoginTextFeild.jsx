import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CURRENT_STATUS } from "../../statusIndicator";
import LoadingPage from "../LoadingPage";
import ToastContainer from "rsuite/esm/toaster/ToastContainer";
import { toast } from "react-toastify";
const LoginTextFeild = ({ idRef }) => {
  const navigation = useNavigate();
  const disableClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const [status, setStatus] = useState(CURRENT_STATUS.IDEAL);
  const navigate = useNavigate();
  const [RFID, setRFID] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); 
    if (RFID !== "") {
      try {
        setStatus(CURRENT_STATUS.LOADING);
       
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/emp/login`,
          {
            empId: RFID,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      
        setStatus(CURRENT_STATUS.SUCCESS);
      
        if (res.status === 200) {
          document.cookie = `token=${res.data.token}`;
         

          const decodedToken = jwtDecode(res.data.token);
        

          if (decodedToken.role === "Manager") {
            navigate("/Manager");
          } else if(decodedToken.role === 'Admin') {
            navigate(`/Admin`); 
          }else {
            navigate(`/Employee`); 
        }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
    
          navigate("/error404");
          toast.error("Employee not found"); 
          setTimeout(() => navigate('/'), 3000);
        } else if (err.response && err.response.status === 500) {
          navigate("/error500");
          setTimeout(() => setError(""), 3000);
        } else {
          setError("Login failed. Please try again.");
        }
        console.log(err.message);
        setStatus(CURRENT_STATUS.IDEAL); // Reset status if login fails
      }
    } else {
      setError("Scan Properly");
    }
  };

  if (status === CURRENT_STATUS.LOADING) {
    return <LoadingPage />;
  }

  return status === CURRENT_STATUS.LOADING ? (
    <LoadingPage />
  ) : (
    <div className=" flex items-center justify-center  bg-gray-100 px-4 sm:px-6 lg:px-8 ">
      <ToastContainer/>
      <div className="bg-white rounded-lg shadow-lg flex    flex-col items-center p-6 w-full max-w-md">
        {error && <p className="error text-red-500 text-center">{error}</p>}
        <form className="w-full" onSubmit={handleLogin}>
          {" "}
          {/* Attach handleLogin to form submission */}
          <div className="mb-6">
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md "
              placeholder="empId"
              autoFocus
              ref={idRef}
              value={RFID}
              onChange={(e) => setRFID(e.target.value)}
            />
          </div>
          {/* <button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          >
            Log In
          </button>{" "} */}
          {/* Add a submit button */}
        </form>
      </div>
    </div>
  );
};

export default LoginTextFeild;
