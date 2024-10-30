import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { MdMessage, MdClose, MdEdit } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CURRENT_STATUS } from "../../statusIndicator";
import { BeatLoader } from "react-spinners";
import accept from "../../images/accept.png";
import decline from "../../images/cancel.png";

const Table = ({ cardData }) => {
  const headers = [
    "S.No",
    "Name",
    "Type",
    "Leave-Type",
    "From",
    "To",
    "Days",
    "Reason",
    "Action",
    "Edit", // Added separate column for Edit button
  ];

  // const [isActionPopupOpen, setActionPopupOpen] = useState(false);
  const [isReasonPopupOpen, setReasonPopupOpen] = useState(false);
  // const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [leaveStatus, setLeaveStatus] = useState({});
  const [editRowId, setEditRowId] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReason, setSelectedReason] = useState(null);
  const [status, setStatus] = useState(CURRENT_STATUS.IDEAL);

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const rowsPerPage = 6;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    getData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAccept = async (id, status) => {
    try {
      setStatus(CURRENT_STATUS.LOADING);
      if (status === "Pending") {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/leave/accept`,
          {
            leaveId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStatus(CURRENT_STATUS.IDEAL);

        if (response.status === 200) {
          toast.success("Leave request approved successfully!");
        } else {
          toast.error("Failed to approve leave request.");
        }
      } else if (status === "Denied") {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/leave/acceptRejected`,
          {
            leaveId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStatus(CURRENT_STATUS.IDEAL);

        if (response.status === 200) {
          toast.success("Leave request updated successfully!");
        } else {
          toast.error("Failed to update leave request.");
        }
      } else {
        toast.warn("Leave already in status Approved");
      }

      getData();
      cardData();
      setEditRowId(null);
    } catch (error) {
      setStatus(CURRENT_STATUS.IDEAL);
      console.error("Error accepting leave:", error);
      toast.error("Failed to send request");
      setEditRowId(null);
    }
  };

  const handleReject = async (id, status) => {
    try {
      setStatus(CURRENT_STATUS.LOADING);
      if (status === "Pending") {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/leave/deny`,
          {
            leaveId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStatus(CURRENT_STATUS.IDEAL);

        if (response.status === 200) {
          toast.success("Leave request declined successfully!");
        } else {
          toast.error("Failed to deny leave request.");
        }
      } else if (status === "Approved") {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/leave/rejectAccepted`,
          {
            leaveId: id,
            empId: empId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStatus(CURRENT_STATUS.IDEAL);

        if (response.status === 200) {
          toast.success("Leave request updated successfully!");
        } else {
          toast.error("Failed to update leave request.");
        }
      } else {
        toast.warn("Leave already in status Rejected");
      }

      getData();
      cardData();
      setEditRowId(null);
    } catch (error) {
      setStatus(CURRENT_STATUS.IDEAL);
      console.error("Error rejecting leave:", error);
      toast.error("Failed to send request");
      setEditRowId(null);
    }
  };

  const handleEditClick = (id) => {
    setEditRowId(id);
  };

  const handleCancelEdit = () => {
    setEditRowId(null);
  };

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filteredData = response.data.reverse();
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setReasonPopupOpen(true);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const dataToDisplay = data.slice(startIndex, endIndex);

  return (
    <div className="w-[100%] p-3 border-slate-950 rounded-lg">
      <ToastContainer />
      <div className="w-[100%] overflow-x-auto">
        <table className="divide-y divide-gray-200 bg-white w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-3 text-left font-bold text-sm text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-lg">
            {" "}
            {/* Increased row size */}
            {dataToDisplay.map((row, rowIndex) => (
              <tr key={rowIndex + 1} className="">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 text-center">
                  {rowIndex + 1}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                  {row.empName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                  {row.role}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                  {row.leaveType}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                  {row.from.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                  {row.to.date}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                  {row.leaveDays}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-md font-medium  text-gray-900 cursor-pointer">
                  <MdMessage onClick={() => handleReasonClick(row.reason)} />
                </td>
                <td className=" text-md font-medium text-sm flex gap-2 pt-2 justify-center items-center h-full">
                  {editRowId === row._id ? (
                    <>
                      <div
                        onClick={() => handleAccept(row._id, row.status)}
                        className="flex justify-center cursor-pointer items-center"
                      >
                        <img
                          src={accept}
                          alt="approve"
                          width={25}
                          height={25}
                        />
                      </div>
                      <div
                        onClick={() => handleReject(row._id, row.status)}
                        className="flex justify-center cursor-pointer items-center"
                      >
                        <img
                          src={decline}
                          alt="decline"
                          width={25}
                          height={25}
                        />
                      </div>
                      <button
                        onClick={handleCancelEdit}
                        className="ml-2 bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span
                      className={
                        row.status === "Pending"
                          ? "text-yellow-500 text-md"
                          : row.status === "Approved"
                          ? "text-green-500"
                          : "text-red-500 text-md"
                          
                      }
                    >
                      {row.status}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-md font-medium">
                  <button
                    onClick={() => handleEditClick(row._id)}
                    className="ml-2 bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    <MdEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Table;
