import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";


const Details = () => {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(""); // State to store selected type
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]); // Store all employees

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const empId = decodedToken.empId;

  const handleCheckboxChange = (id) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((empId) => empId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    try {
      const allEmp = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/getAll`,
        { empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAllEmployees(allEmp.data); // Store all employees in state
      setFilteredEmployees(allEmp.data); // Initialize filteredEmployees with all employees
    } catch {
      console.log("error");
    }
  };

  // Function to filter employees based on search and type filter
  const filterEmployees = () => {
    const filtered = allEmployees.filter((employee) => {
      const matchesSearchTerm = employee.empName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "" || employee.role === selectedType;
      return matchesSearchTerm && matchesType;
    });
    setFilteredEmployees(filtered);
  };

  // Trigger filtering every time searchTerm or selectedType changes
  useEffect(() => {
    filterEmployees();
  }, [searchTerm, selectedType]);

  const handleSendCircular = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitCircular = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/circular/save`,
        {
          empId: empId,
          empName: decodedToken.empName,
          message: content,
          subject: subject,
          list: selectedEmployees,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // if(res.status===200){
      //   toast.success("Circular sent Successfully");

      // }
      // else{
      //   toast.error("Error in sending Circular ");

      // }

    } catch (e) {
      console.error("Error sending circular", e);
      toast.error("Error in sending Circular ");

    }
    setSubject("");
    setContent("");
    setIsModalOpen(false);
    setSelectedEmployees([]);
  };

  return (
    <div className="bg-white p-5 w-full h-full mx-auto flex flex-col justify-start items-start">
            <ToastContainer />
      <div className="mb-6 flex justify-start items-start space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
          placeholder="Search Employee"
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

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-300 text-black">
            <th className="p-4 border">Select</th>
            <th className="p-4 border">Employee ID</th>
            <th className="p-4 border">Employee Name</th>
            <th className="p-4 border">Type</th>
            <th className="p-4 border">DOJ</th>
            <th className="p-4 border">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr
                key={employee.empId}
                className={`text-center ${
                  selectedEmployees.includes(employee.empPhone)
                    ? "bg-gray-100"
                    : ""
                } hover:bg-gray-50`}
              >
                <td className="p-4 border">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.empPhone)}
                    onChange={() => handleCheckboxChange(employee.empPhone)}
                    className="w-5 h-5 text-gray-600"
                  />
                </td>
                <td className="p-4 border">{employee.empId}</td>
                <td className="p-4 border">{employee.empName}</td>
                <td className="p-4 border">{employee.role}</td>
                <td className="p-4 border">{employee.dateOfJoining}</td>
                <td className="p-4 border">{employee.empPhone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedEmployees.length > 0 && (
        <div className="flex justify-end mt-6 fixed bottom-16 right-4">
          <button
            onClick={handleSendCircular}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-500 transition-colors duration-300 fixed bottom-16 right-4"
          >
            Send Circular
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Send Circular</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                placeholder="Enter the subject"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600"
                placeholder="Enter the content"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSubmitCircular}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors duration-300"
              >
                Submit
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
