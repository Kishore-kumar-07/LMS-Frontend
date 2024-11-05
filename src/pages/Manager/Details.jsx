import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { useNavigate } from "react-router-dom";
import ExcelJS from "exceljs";



const getRandomLeaveDate = (month) => {
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(2023, month, day).toLocaleDateString();
};

const getRandomOvertimeHours = () => {
  return Math.floor(Math.random() * 10);
}


const Details = () => {
  const navigation = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(""); // State to store selected type
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]); // Store all employees
  const [data, setData] = useState([]);


  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportData = () => {
    const exportFields = filteredEmployees.map(({ empId, empName, empMail, empPhone, role, gender, dateOfJoining, department, unit , level }) => ({
      EmployeeID: empId,
      EmployeeName: empName,
      EmployeeMail: empMail,
      EmployeePhoneNumber: empPhone,
      Type: role,
      Gender : gender,
      DOJ: dateOfJoining,
      Department : department,
      Unit : unit, 
      Level : level
    }));

    const ws = XLSX.utils.json_to_sheet(exportFields);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Report" + fileExtension);
  };

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

    const dummyData = [];
    for (let i = 1; i <= 15; i++) {
      dummyData.push({
        sno: i,
        vendor: `Vendor ${String.fromCharCode(64 + i)}`,
        employeeCode: `E00${i}`,
        employeeName: `Employee ${i}`,
        department: `Department ${i % 3 + 1}`,
        unit: `Unit ${i % 4 + 1}`,
        function: `Function ${i % 5 + 1}`,
        reportingManager: `Manager ${i % 2 + 1}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        jan: getRandomLeaveDate(0),
        feb: getRandomLeaveDate(1),
        mar: getRandomLeaveDate(2),
        apr: getRandomLeaveDate(3),
        may: getRandomLeaveDate(4),
        jun: getRandomLeaveDate(5),
        jul: getRandomLeaveDate(6),
        aug: getRandomLeaveDate(7),
        sep: getRandomLeaveDate(8),
        oct: getRandomLeaveDate(9),
        nov: getRandomLeaveDate(10),
        dec: getRandomLeaveDate(11),
        janOt: getRandomOvertimeHours(),
        febOt: getRandomOvertimeHours(),
        marOt: getRandomOvertimeHours(),
        aprOt: getRandomOvertimeHours(),
        mayOt: getRandomOvertimeHours(),
        junOt: getRandomOvertimeHours(),
        julOt: getRandomOvertimeHours(),
        augOt: getRandomOvertimeHours(),
        sepOt: getRandomOvertimeHours(),
        octOt: getRandomOvertimeHours(),
        novOt: getRandomOvertimeHours(),
        decOt: getRandomOvertimeHours(),
      });
    }
    setData(dummyData);
  }, []);



  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Employee Data");

    // Define columns
    sheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Vendor", key: "vendor", width: 20 },
      { header: "Employee Code", key: "employeeCode", width: 15 },
      { header: "Employee Name", key: "employeeName", width: 25 },
      { header: "Department", key: "department", width: 20 },
      { header: "Unit", key: "unit", width: 15 },
      { header: "Function", key: "function", width: 20 },
      { header: "Reporting Manager", key: "reportingManager", width: 25 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Jan", key: "jan", width: 10 },
      { header: "Feb", key: "feb", width: 10 },
      { header: "Mar", key: "mar", width: 10 },
      { header: "Apr", key: "apr", width: 10 },
      { header: "May", key: "may", width: 10 },
      { header: "Jun", key: "jun", width: 10 },
      { header: "Jul", key: "jul", width: 10 },
      { header: "Aug", key: "aug", width: 10 },
      { header: "Sep", key: "sep", width: 10 },
      { header: "Oct", key: "oct", width: 10 },
      { header: "Nov", key: "nov", width: 10 },
      { header: "Dec", key: "dec", width: 10 },
      { header: "Jan", key: "janOt", width: 10 },
      { header: "Feb", key: "febOt", width: 10 },
      { header: "Mar", key: "marOt", width: 10 },
      { header: "Apr", key: "aprOt", width: 10 },
      { header: "May", key: "mayOt", width: 10 },
      { header: "Jun", key: "junOt", width: 10 },
      { header: "Jul", key: "julOt", width: 10 },
      { header: "Aug", key: "augOt", width: 10 },
      { header: "Sep", key: "sepOt", width: 10 },
      { header: "Oct", key: "octOt", width: 10 },
      { header: "Nov", key: "novOt", width: 10 },
      { header: "Dec", key: "decOt", width: 10 },
    ];

    // Add merged headers
    sheet.mergeCells("J1:U1");
    sheet.getCell("J1").value = "Leave Date";
    sheet.getCell("J1").alignment = { horizontal: "center" };
    sheet.getCell("J1").font = { bold: true, color: { argb: "FFFFFF" } };
    sheet.getCell("J1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };

    sheet.mergeCells("V1:AG1");
    sheet.getCell("V1").value = "Overtime Hours";
    sheet.getCell("V1").alignment = { horizontal: "center" };
    sheet.getCell("V1").font = { bold: true, color: { argb: "FFFFFF" } };
    sheet.getCell("V1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1F4E78" } };

    // Add sub-header row
    const headerRow = sheet.getRow(2);
    headerRow.values = [
      " ", " ", " ", " ", "", 
      " ", " ", " ", " ", 
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
      "Aug", "Sep", "Oct", "Nov", "Dec",
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", 
      "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9EAD3" } };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add rows with data and style
    data.forEach((row) => {
      const rowData = sheet.addRow(row);
      rowData.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (colNumber >= 10 && colNumber <= 33) {
          cell.alignment = { horizontal: "center" };
        }
      });
    });

    // Export workbook
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "EmployeeData.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };



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
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
      console.log("error");
    }
  };

  // Function to filter employees based on search and type filter
  const filterEmployees = () => {
    const filtered = allEmployees.filter((employee) => {
      const matchesSearchTerm = employee.empName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "" || employee.role === selectedType;
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
      <div className="mb-6 flex justify-between items-start space-x-4 w-full">
        <div className="flex gap-5">
        
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
        <div className="pr-5">
          <button
            onClick={exportExcelFile}
            className="p-2 bg-green-300 text-black w-20 h-10 font-semibold rounded-lg "
          >
            Export 
          </button>
          
        </div>
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
