import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { MdMessage, MdClose, MdEdit } from "react-icons/md";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { IoMdSearch } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";
import { BeatLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import { CURRENT_STATUS } from "../../statusIndicator";

const PermissionTable = () => {
  const headers = [
    "S.No",
    "Name",
    "Type",
    "From",
    "To",
    "Hours",
    "Reason",
    "Status",
    "Action",
  ];

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReason, setSelectedReason] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [status, setStatus] = useState(CURRENT_STATUS.IDEAL);

  const rowsPerPage = 6; // Adjust as needed
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApprove = async (id) => {
    try {
      setStatus(CURRENT_STATUS.LOADING);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/accept`,
        {
          permissionId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setStatus(CURRENT_STATUS.SUCCESS);
      if (response.status === 200) {
        toast.success(`Permission request Approved successfully!`);
        getData();
      } else {
        toast.error(`Failed to Approve Permission request.`);
      }
    } catch (error) {
      console.error(`Error in approving permission`, error);
    }
  };

  const handleReject = async (id) => {
    try {
      setStatus(CURRENT_STATUS.LOADING);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/deny`,
        {
          permissionId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStatus(CURRENT_STATUS.SUCCESS);

      if (response.status === 200) {
        toast.error(`Permission request Rejected successfully!`);
        getData();
      } else {
        toast.error(`Failed to Approve Rejected request.`);
      }
    } catch (error) {
      console.error(`Error in rejecting permission `, error);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditPopupOpen(true);
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setPopupOpen(true);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/getPermission`,
        {
          empId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filteredData = response.data.reverse();
      setFilteredData(filteredData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const dataToDisplay = filteredData.slice(startIndex, endIndex);

  return (
    <div className="w-[100%] p-3 border-slate-950 rounded-lg">
      <ToastContainer />

      <div className="w-[100%] overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-3 text-left font-bold text-sm text-gray-500 uppercase tracking-wider  "
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dataToDisplay.map((row, rowIndex) => (
              <tr key={rowIndex + 1} className="h-fit">
                <td className=" text-md font-medium  text-gray-900 px-2 py-2">
                  {startIndex + rowIndex + 1}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.empName}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.role}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.from}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.to}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-md font-medium text-gray-900 justify-center items-center">
                  {row.hrs < 1
                    ? `${(row.hrs * 60).toFixed(2)} mins`
                    : `${row.hrs.toFixed(2)} hrs`}
                </td>
                <td
                  className="px-2 py-2 whitespace-nowrap text-2xl font-medium text-gray-900 cursor-pointer justify-center items-center"
                  onClick={() => handleReasonClick(row.reason)}
                >
                  <MdMessage />
                </td>
                <td
                  className={`px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 gap-4 ${
                    row.status === "Approved"
                      ? "text-green-500"
                      : row.status === "Denied"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {row.status}
                </td>
                {status === CURRENT_STATUS.LOADING ? (
                  <td>
                    {" "}
                    <div className="w-full flex justify-center items-center py-2">
                      <BeatLoader
                        color="#66ded2"
                        margin={1}
                        size={7}
                        speedMultiplier={1}
                      />
                    </div>
                  </td>
                ) : (
                  <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900  gap-4">
                    <button
                      className="text-green-500 hover:text-green-700 m-2 text-2xl"
                      onClick={() => handleApprove(row._id)}
                    >
                      ☑
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 text-2xl"
                      onClick={() => handleReject(row._id)}
                    >
                      ☒
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        content={selectedReason}
      />
      <EditPopup
        isOpen={editPopupOpen}
        onClose={() => setEditPopupOpen(false)}
        row={selectedRow}
      />
    </div>
  );
};

const Popup = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Details</h2>
          <button onClick={onClose} className="text-black hover:text-gray-500">
            <MdClose size={24} />
          </button>
        </div>
        <div className="text-black">{content}</div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const EditPopup = ({ isOpen, onClose, row, onStatusChange }) => {
  if (!isOpen || !row) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-white text-black p-6 rounded-lg shadow-lg z-10 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Permission</h2>
          <button onClick={onClose} className="text-black hover:text-gray-500">
            <MdClose size={24} />
          </button>
        </div>
        <div className="text-black">
          <p>Employee: {row.empName}</p>
          <p>Type: Permission</p>
          <p>From: {row.from}</p>
          <p>To: {row.to}</p>
          <p>
            Hours:{" "}
            {row.hrs < 1
              ? `${(row.hrs * 60).toFixed(2)} mins`
              : `${row.hrs.toFixed(2)} hrs`}
          </p>
          <p>Reason: {row.reason}</p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              onStatusChange(row._id, "Approved");
              onClose();
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Approve
          </button>
          <button
            onClick={() => {
              onStatusChange(row._id, "Denied");
              onClose();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionTable;
