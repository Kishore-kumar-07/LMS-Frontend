import { useEffect, useState, useRef } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const NotificationButton = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [circulars, setCirculars] = useState([]);
  
  const token = document.cookie.split("=")[1];
  const decodedToken = jwtDecode(token);
  const tooltipRef = useRef(null); // reference for the tooltip div

  useEffect(() => {
    getCircular();
  }, []);

  const getCircular = async () => {
    try {
      var res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/circular/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCirculars(res.data);
    } catch (e) {
      console.log("ERROR IN CIRCULAR");
    }
  };

  // Close tooltip if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setTooltipVisible(false);
      }
    };
    
    if (isTooltipVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTooltipVisible]);

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setPopupVisible(true);
    setTooltipVisible(false);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  const handleMarkAsRead = () => {
    setPopupVisible(false);
    setCirculars((prev) =>
      prev.filter((n) => n.id !== selectedNotification.id)
    );
    setSelectedNotification(null); // same functionality as close
  };

  return (
    <div className="relative inline-block">
      <button
        className="focus:outline-none"
        onClick={() => setTooltipVisible(!isTooltipVisible)}
      >
        <FaBell
          className={`size-7 ${
            circulars.length === 0 ? "text-black" : "text-yellow-400"
          }`}
        />
      </button>
      
      {isTooltipVisible && (
        <div
          ref={tooltipRef} // reference for the tooltip div
          className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-2 w-96 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
        >
          <div className="p-5 bg-gradient-to-r from-blue-100 to-white rounded-t-lg shadow-md">
            <h3 className="text-gray-800 font-semibold text-lg mb-3">Notifications</h3>
          </div>
          <div className="bg-white max-h-60 overflow-y-auto">
            <ul className="py-2">
              {circulars.length > 0 ? (
                circulars.map((notification) => (
                  <li
                    key={notification.id}
                    className="px-5 py-4 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div>
                      <p className="text-blue-600 font-semibold">{notification.subject}</p>
                      <p className="text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
                    </div>
                    <div className="ml-auto">
                      <FaBell className="text-yellow-400" />
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-5 py-4 text-center text-gray-500">No new notifications</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {isPopupVisible && selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleClosePopup}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-bold">Notification</h2>
            <p className="mt-2">
              <span className="font-semibold">Employee Name:</span> {selectedNotification.empName}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Subject:</span> {selectedNotification.subject}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Message:</span> {selectedNotification.message}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              <span className="font-semibold">Date:</span> {formatDate(selectedNotification.createdAt)}
            </p>
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
                onClick={handleMarkAsRead}
              >
                Mark as Read
              </button>
              <button
                className="bg-red-500 text-white py-1 px-4 rounded"
                onClick={handleClosePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
