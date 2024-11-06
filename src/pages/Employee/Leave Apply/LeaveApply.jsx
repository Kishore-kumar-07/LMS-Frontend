import React from "react";
import LeaveDetailTable from "./LeaveDetailTable";
import Leaveform from "./Leaveform";

function LeaveApply({ isPaternity, isAdoption }) {
  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="w-full  flex flex-col lg:flex-row justify-center items-center lg:justify-between gap-5 px-10  ">
        <Leaveform isPaternity={isPaternity} isAdoption={isAdoption} />
        <LeaveDetailTable />
      </div>
    </div>
  );
}

export default LeaveApply;
