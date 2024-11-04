import React from "react";
import LeaveDetailTable from "./LeaveDetailTable";
import Leaveform from "./Leaveform";

function LeaveApply({isPaternity,isAdoption}) {
  return (
    <div className="w-screen">
      <div className="w-full flex justify-evenly ">
      <Leaveform isPaternity={isPaternity} isAdoption={isAdoption} />
      <LeaveDetailTable />
      </div>
    </div>
  );
}

export default LeaveApply;
