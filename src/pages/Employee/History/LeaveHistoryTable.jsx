import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LeaveHistoryTable = (props) => {
  const tableHead = [
    "S.No",
    "Leave Type",
    "From Date",
    "To Date",
    "No of Days",
    "Reason of Leave",
    "Status",
    "LOP",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const totalPages = Math.ceil(props.LeaveLogs.length / rowsPerPage);

  const currentData = props.LeaveLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [stauts, setStatus] = useState("");

  useEffect(() => {}, [stauts]);

  const withDrawStatus = async (leaveId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/cancelLeave`,
        { leaveId: leaveId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res);
    } catch (error) {}
  };

  return (
    <>
      <div className="w-full h-full p-5  rounded-lg">
        <div className="w-full bg-">
          <h1 className="text-xl font-semibold mb-2">Leave Log</h1>
        </div>
        <div className="flex flex-wrap flex-col w-full">
          <table className="table-fixed">
            <thead className="divide-y divide-gray-200 bg-white">
              <tr className="bg-gray-50">
                {tableHead.map((val, index) => (
                  <th
                    key={index}
                    className="px-6 py-5 text-left text-xs font-medium text-gray-500 uppercase tracking-widest"
                  >
                    {val}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((val, index) => {
                // Determine background color based on status
                const statusBgColor =
                  val.status === "Approved"
                    ? "bg-green-100"
                    : val.status === "Denied"
                    ? "bg-red-100"
                    : val.status === "Withdrawn"
                    ? "bg-gray-400"
                    : "bg-yellow-100";

                return (
                  <tr key={index}>
                    <td className="px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {index + 1}
                    </td>
                    {/* <td className='px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900'>{val.empName}</td> */}
                    <td className="px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.leaveType}
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.from.date}
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.to.date}
                    </td>
                    <td className="px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.leaveDays}
                    </td>
                    {/* <td className='px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900'>{val.reasonType}</td> */}
                    <td className="px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.reason}
                    </td>
                    <td
                      className={`px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900`}
                    >
                      {val.status !== "Pending" ? (
                        <span  className={`w-full border rounded-md py-2 px-5 focus:outline-none focus:ring ${statusBgColor}`}>{val.status}</span>
                      ) : (
                        <select
                          onChange={(e) => {
                            setStatus(e.target.value);
                            withDrawStatus(val._id);
                          }}
                          className={` border rounded-md py-2 px-2 focus:outline-none focus:ring ${statusBgColor}`}
                        >
                          {["Pending", "Withdraw"].map((optionVal) => (
                            <option key={optionVal}>{optionVal}</option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.LOP}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
};

export default LeaveHistoryTable;
