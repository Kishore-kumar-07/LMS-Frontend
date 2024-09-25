import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import LeaveHistoryTable from './LeaveHistoryTable';
import PermissionHistoryTable from './PermissionHistoryTable';

function History() {
  const token = document.cookie.split('=')[1];
  const decodedToken = jwtDecode(token);

  const [leaveLogs, setLeaveLogs] = useState([]);
  const [permissionLogs, setPermissionLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('leave'); // State to control the active tab

  useEffect(() => {
    getEmployeeLeaveLogs();
    getEmployeePermissionsLogs();
  }, []);

  const getEmployeeLeaveLogs = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/leave/getLeave`,
        { empId: decodedToken.empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setLeaveLogs(res.data);
    } catch (e) {
      console.error('History Error', e);
    }
  };

  const getEmployeePermissionsLogs = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/permission/getPermission`,
        { empId: decodedToken.empId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setPermissionLogs(res.data);
    } catch (e) {
      console.error('History Error', e);
    }
  };

  return (
    <div className="h-full w-screen flex ">
      {/* Sidebar */}
      <div className="w-[10%] bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">History</h2>
        <button
          className={`w-full p-2 text-lg font-semibold mb-1 rounded ${activeTab === 'leave' ? 'text-blue-500 bg-slate-500 bg-opacity-40 ' : 'text-white-700 hover:bg-gray-600'}`}
          onClick={() => setActiveTab('leave')}
        >
          Leave
        </button>
        <button
          className={`w-full p-2 text-lg font-semibold rounded ${activeTab === 'permission' ? 'text-blue-500 bg-slate-500 bg-opacity-40 ' : 'text-white-700 hover:bg-gray-600'}`}
          onClick={() => setActiveTab('permission')}
        >
          Permission
        </button>
      </div>

      {/* Main Content */}
      <div className="w-[100%] flex justify-center items-start p-4">
        {activeTab === 'leave' ? (
          <LeaveHistoryTable LeaveLogs={leaveLogs} />
        ) : (
          <PermissionHistoryTable PermissionLogs={permissionLogs} />
        )}
      </div>
    </div>
  );
}

export default History;
