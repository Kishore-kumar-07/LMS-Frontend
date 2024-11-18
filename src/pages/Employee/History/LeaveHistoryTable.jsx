import React, { useState } from "react";
import Pagination from "./Pagination";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LeaveHistoryTable = ({ LeaveLogs, setReload, reload }) => {
  const tableHead = [
    "S.No",
    "Leave Type",
    "From Date",
    "To Date",
    "No of Days",
    "Reason of Leave",
    "Status",
    // "LOP",
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  const totalPages = Math.ceil(LeaveLogs.length / rowsPerPage);

  const currentData = LeaveLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

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
      setReload(!reload);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdrawClick = (leave) => {
    setSelectedLeave(leave);
    setPopupVisible(true);
  };

  const handleWithdrawConfirm = () => {
    if (selectedLeave) {
      console.log(selectedLeave._id);
      withDrawStatus(selectedLeave._id);
    }
    setPopupVisible(false);
  };

  const handleWithdrawCancel = () => {
    setPopupVisible(false);
  };

  return (
    <>
      <div className="w-full h-full p-5 rounded-lg">
        <div className="w-full">
          <h1 className="text-xl font-semibold mb-2">Leave Log</h1>
        </div>
        <div className="flex flex-wrap flex-col w-full">
          <table className="table-fixed">
            <thead className="divide-y divide-gray-200 bg-white">
              <tr className="bg-gray-50">
                {tableHead.map((val, index) => (
                  <th
                    key={index}
                    className="px-6 py-5  text-xs font-medium text-gray-500 uppercase tracking-widest"
                  >
                    {val}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((val, index) => {
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
                    <td className="px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.reason}
                    </td>
                    <td
                      className={`px-3 py-5 whitespace-nowrap text-sm font-medium text-center text-gray-900`}
                    >
                      {val.status !== "Pending" ? (
                        <span
                          className={`w-full border rounded-md py-2 px-5 focus:outline-none focus:ring ${statusBgColor}`}
                        >
                          {val.status}
                        </span>
                      ) : (
                        <div className="flex gap-2 w-full justify-center items-center" >
                          <span
                            className={`ml-5 border rounded-md py-2 px-5 focus:outline-none focus:ring ${statusBgColor}`}
                          >
                            {val.status}{" "}
                          </span>
                          <button
                            className="rounded-full bg-[#f5f6f7] shadow-md  text-slate-500 px-2 py-1"
                            onClick={() => handleWithdrawClick(val)}
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </td>
                    {/* <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-center text-gray-900">
                      {val.LOP}
                    </td> */}
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

      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-3">
              Do you want to withdraw this leave on{" "}
              <span className="text-blue-500">{selectedLeave?.from.date}</span>?
            </h2>
            <div className="flex justify-end space-x-3">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={handleWithdrawCancel}
              >
                No
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleWithdrawConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveHistoryTable;
