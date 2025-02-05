import React, { useState } from "react";
import LeaveDetailTable from "./LeaveDetailTable";
import Leaveform from "./Leaveform";
import LogOutPopOut from "./LogOutPopOut";
import PropTypes from 'prop-types';

function LeaveApply({ isPaternity, isAdoption }) {
  LeaveApply.propTypes = {
    isPaternity: PropTypes.bool.isRequired,
    isAdoption: PropTypes.bool.isRequired,
  };

  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      {/* Logout Popup Overlay */}
      {showLogout && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 z-50">
          <LogOutPopOut onClose={() => setShowLogout(false)} />
        </div>
      )}

      {/* Main Page Content */}
      <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:justify-between gap-5 px-10">
        <Leaveform isPaternity={isPaternity} isAdoption={isAdoption} setShowLogout={setShowLogout}  />
        <LeaveDetailTable />
      </div>
    </div>
  );
}

export default LeaveApply;
