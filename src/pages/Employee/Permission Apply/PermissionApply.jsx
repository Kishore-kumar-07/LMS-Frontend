import React, { useState } from "react";
import PermissionDetailTable from "./PermissionDetailsTable";
import PermissionForm from "./PermissionForm";
import LogOutPopOut from "../Leave Apply/LogOutPopOut";

function PermissionApply() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="h-screen w-screen flex justify-around items-center relative">
      {/* Logout Pop-up Overlay */}
      {showLogout && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 z-50">
          <LogOutPopOut onClose={() => setShowLogout(false)} />
        </div>
      )}

      {/* Main Content */}
      <PermissionForm  setShowLogout = {setShowLogout}/>
      <PermissionDetailTable />

      
    </div>
  );
}

export default PermissionApply;
