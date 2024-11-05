import React , {useEffect, useRef} from 'react'
import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Register from './Register'
import * as XLSX from 'xlsx';
import delete_ from "../../images/delete.png";
import edit from "../../images/edit.png";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import EditRegister from './EditRegister';
import "react-toastify/dist/ReactToastify.css";

const Employee = () => {
  const fileInputRef = useRef(null);

  const navigation = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [allEmployees , setAllEmployees] = useState([]);
  const [openRegisterModal , setOpenRegisterModal] = useState(false);
  const [fileData , setFileData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [filteredData, setFilteredData] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const adminId = decodedToken.empId;

  useEffect(()=>{
    getEmployees();
  },[])

  useEffect(() => {
    filterData();
  }, [allEmployees, searchTerm, selectedType]);
  
  const getEmployees = async () => {
    try {
      const allEmp = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/getAll`,
        { empId : adminId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(allEmp.data);
      setAllEmployees(allEmp.data); 
      
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

  const handleAddNewUser = () =>{
    setOpenRegisterModal(!openRegisterModal);
  }

  useEffect(()=>{
    console.log(fileData)
    saveImportData();
  },[fileData])

  const saveImportData = async() =>{
    if(fileData == "") return;
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/import`,
        {
          id : adminId,
          emp : fileData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      if(res.status === 200){
        toast.success("Data imported successfully")
        getEmployees();
        setFileData([]);
      }
       
      
    } catch (error) {
      toast.error("Error in Importing Data")
      console.log("error");
    }
  }

  const importData = () => {
    fileInputRef.current.click();
  };

  const handleEditClick = (employee) => {
    setCurrentEmployee(employee); 
    setOpenEditModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setDeleteModal(!deleteModal);
  };

  const deleteConfirm = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/emp/delete`,
        { 
          id: adminId,
          empId: deleteId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      setDeleteModal(false);
      toast.success("Employee deleted Successfully"); 
      getEmployees(); 
       
    } catch (error) {
      toast.error("Error in Deleting Employee"); // Error toast in case of failure
      console.log("error");
    }
  };
  

  useEffect(()=>{
    filterData();
  },[allEmployees])

  const filterData = () =>{
    const filteredData = allEmployees.filter((row)=>row.role === "3P" || row.role === "GVR");
    const filtered = filteredData.filter((row) => {
      const matchesType =
        selectedType === "" || row.role.toLowerCase() === selectedType.toLowerCase();
      const matchesSearchTerm =
        searchTerm === "" || row.empName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearchTerm;
    });
    setFilteredData(filtered);
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);
      console.log(sheetData);
      setFileData(sheetData);
    };

    reader.readAsBinaryString(file);
  };


  return (
    <>
    <div className='w-full h-full flex flex-col '>
      <ToastContainer/>
      <div className='w-full h-[10%] flex justify-between pr-5 pl-5 pt-2 pb-2'>
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
        <div className='w-2'>

        </div>
        <div className="pr-5 gap-3 flex">
          <button
            onClick={handleAddNewUser}
            className="p-2 bg-green-300 text-black w-20 h-10 font-semibold rounded-lg "
          >
            + Add
          </button>
          <div>
      <button
        onClick={importData}
        className="p-2 bg-blue-300 text-black w-20 h-10 font-semibold rounded-lg"
      >
        Import
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} 
      />
    </div>
        </div>

      </div>
      <div className='w-full pl-5 pr-5 pt-2 pb-2 h-full'> 
      <div className='w-full p-1 h-fit'>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-black">
            
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Employee Name</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Reporting Manager</th>
            <th className="p-2 border">DOJ</th>
            <th className="p-2 border">Phone Number</th>
            <th className="p-2 border">Edit</th>
            <th className="p-2 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((employee) => (
              <tr
                key={employee.empId}
                
              >
               
                <td className="p-4 border">{employee.empId}</td>
                <td className="p-4 border">{employee.empName}</td>
                <td className="p-4 border">{employee.role}</td>
                <td className="p-4 border">{employee.manager}</td>
                <td className="p-4 border">{employee.dateOfJoining}</td>
                <td className="p-4 border">{employee.empPhone}</td>
                <td className="border text-md font-medium text-sm flex gap-2 h-[100%]  p-4 ">
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="ml-2 text-white px-2 py-1 rounded"
                    >
                      <img src={edit} height={25} width={25}></img>

                    </button>
                  </td>
                  <td className="border px-4 py-4 text-md font-medium">
                    <button
                      onClick={() => handleDeleteClick(employee.empId)}
                      className="ml-2  text-white px-2 py-1 rounded"
                    >
                      <img src={delete_} height={25} width={25}></img>
                    </button>
                  </td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="p-4 text-center text-gray-500 w-full">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
      {openRegisterModal && (
<div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-2 rounded-lg shadow-2xl w-[95%] h-[95%] flex justify-center items-center">
    <Register setOpenRegisterModal = {setOpenRegisterModal} getEmployees = {getEmployees}/>
  </div>
</div>
      )}
      {deleteModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-[40%] max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone. Please confirm if you would like to proceed with deleting.</p>
            
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={handleDeleteClick} // Assume this function cancels the deletion
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={deleteConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
        
        )}
        {openEditModal && (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-2 rounded-lg shadow-2xl w-[80%] h-[80%] flex justify-center items-center">
      <EditRegister
        setOpenEditModal={setOpenEditModal}
        currentEmployee={currentEmployee}
        getEmployees = {getEmployees}
      />
    </div>
  </div>
        )}
    </div>
    </>
  )
}

export default Employee