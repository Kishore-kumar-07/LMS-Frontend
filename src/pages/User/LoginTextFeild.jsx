import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CURRENT_STATUS } from "../../statusIndicator";
import LoadingPage from "../LoadingPage";

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
        console.log(RFID);
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
        console.log(res.status);
        console.log(res.data.token);
        if (res.status === 200) {
          document.cookie = `token=${res.data.token}`;
          console.log(document.cookie);

          const decodedToken = jwtDecode(res.data.token);
          console.log("decoded", decodedToken);

          if (decodedToken.role === "Manager") {
            navigate("/Manager"); // Redirect to admin page
          } else if(decodedToken.role === 'Admin') {
            navigate(`/Admin`); // Redirect to employee page with ID
          }else {
            navigate(`/Employee`); // Redirect to employee page with ID
          }
        } else if (res.status === 401) {
          setError("Incorrect password");
        }
      } catch (err) {
        if (err.response.status === 400) {
          navigation("/error404");
        }
        if (err.response.status === 500) {
          navigation("/error500");
        }
        console.log(err.message);
        setError("Login failed. Please try again.");
      }
    } else {
      setError("Fill in the credentials properly.");
    }
  };

  if (status === CURRENT_STATUS.LOADING) {
    return <LoadingPage />;
  }

  return status === CURRENT_STATUS.LOADING ? (
    <LoadingPage />
  ) : (
    <div className=" flex items-center justify-center  bg-gray-100 px-4 sm:px-6 lg:px-8 ">
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
