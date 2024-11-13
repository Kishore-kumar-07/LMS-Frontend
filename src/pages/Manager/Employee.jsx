import React from "react";
import user from "../../images/user.png";

const Employee = ({ employeeName, employeeType }) => {
  return (
    <div className="flex w-full gap-10 h-[70px] p-2 justify-evenly items-center rounded-lg border-2">
      <img width={40} height={40} src={user} alt="Logo" />
      <div className="text-1xl  flex  items-center justify-center w-[40%]">
        {employeeName}
      </div>
      <div className="flex flex-col ">
        <div className="flex justify-start items-start ">
          <h1 className="text-1xl ">{employeeType}</h1>
        </div>
      </div>
    </div>
  );
};

export default Employee;
