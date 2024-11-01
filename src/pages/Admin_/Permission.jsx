import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { MdMessage, MdClose, MdEdit } from "react-icons/md";
import delete_ from "../../images/delete.png";
import edit from "../../images/edit.png";

const Permission = () => {
  const navigation = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/getPermission`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filteredData = response.data.reverse();
      console.log(filteredData);
      setLeaveData(filteredData);
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
      console.error("Error fetching data:", error);
    }
  };

  const handleEditClick = () => {

  };

  const handleDeleteClick = () => {
    setDeleteModal(!deleteModal);
  };

  const deleteConfirm = () => {
    setDeleteModal(false);
  };

  const saveEdit = () => {
    
  };

  const headers = [
    "S.No",
    "Name",
    "Type",
    "Reporting Manager",
    "From",
    "To",
    "Hours",
    "Edit",
    "Delete",
  ];
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center ">
        <div className="w-full h-[8%] flex justify-between pr-5 pl-5 pt-2 pb-2">
          <div className="flex gap-5">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
              placeholder="Search by Name"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
            >
              <option value="">All Types</option>
              <option value="GVR">GVR</option>
              <option value="3P">3P</option>
            </select>
          </div>
          <div className="w-2"></div>
          <div className="pr-5 gap-3 flex">
            <input
              type="date"
              className="border border-1 rounded-lg border-black p-2"
            ></input>
          </div>
        </div>
        <div className="w-full pl-5 pr-5 pt-2 pb-2 h-full">
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
              {leaveData.map((row, rowIndex) => (
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
                    {row.reportingManager}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                    {row.from}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                    {row.to}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium  text-gray-900 justify-center items-center">
                    {row.hours}
                  </td>

                  <td className=" text-md font-medium text-sm flex gap-2 h-[100%] pt-2 ">
                    <button
                      onClick={() => handleEditClick(row._id)}
                      className="ml-2 text-white px-2 py-1 rounded"
                    >
                      <img src={edit} height={25} width={25}></img>

                    </button>
                  </td>
                  <td className="px-4 py-2 text-md font-medium">
                    <button
                      onClick={() => handleDeleteClick(row._id)}
                      className="ml-2  text-white px-2 py-1 rounded"
                    >
                      <img src={delete_} height={25} width={25}></img>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {deleteModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-2 rounded-lg shadow-2xl w-[40%] h-[40%] flex justify-center items-center">
            <button className="bg-red-500 p-2 w-fit h-fit rounded-lg" onClick={deleteConfirm}>Confirm</button>
          </div>
        </div>
        )}
      </div>
    </>
  );
};

export default Permission;
