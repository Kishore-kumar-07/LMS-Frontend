import React, { useEffect, useRef } from "react";
import caos from "../../images/caos.png";
import gilbarco from "../../images/GVRLogo.png";
import scanner from "../../images/tap-pay-15575682-unscreen.gif";
import LoginTextFeild from "./LoginTextFeild";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();
  const idRef = useRef();
  const disableClick = (e) => {
    idRef.current?.focus();
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (document.cookie) {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("Logged out, cookie removed");
    }
  }, []);

  const handleLoginButton = () =>{
    navigate('/login')
  }

  return (
    <>
      <div
        className="w-screen h-screen absolute flex  overflow-hidden bg-white "
        onClick={disableClick}
        
      >
        <div className="w-full h-full">
          <div className="bg-[#e0f2fe] rounded-r-3xl h-full rounded-br-full p-5">
            <img src={gilbarco} className="  w-80 p-5" alt="Gilbarco" />
            <h1 className="font-bold text-5xl ml-20 mt-20 text-[#1e303c]">
              Welcome to Gilbarco <br />
              Leave Management System
            </h1>
            <p className="w-[70%] pt-16 pl-20 text-xl font-semibold text-[#1e303c]">
            To log in using RFID, please scan your card. Alternatively, click 'Login' to use your Username and password for authentication.
            </p>
            <div className = " pt-10 pl-20">
              <button className="w-24 h-10 border-2 font-semibold text-lg rounded-lg border-black" onClick={handleLoginButton}>Login</button>
            </div>
            <img src={scanner} className="w-40 h-40 ml-20" alt="Scanner" />
          </div>
        </div>
        <img
          src={caos}
          className="object-cover w-96 h-96 mt-40 mr-20"
          alt="Caos"
        />
      </div>
      <LoginTextFeild idRef={idRef} />
    </>
  );
};

export default Login;
