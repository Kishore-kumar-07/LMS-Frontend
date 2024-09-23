import React, { useState } from 'react';
import { FaBell } from "react-icons/fa";

const NotificationButton = () => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const initialNotifications = [
        { id: 1, title: 'Title 1', content: 'Content for Title 1', date: '2023-09-22' },
        { id: 2, title: 'Title 2', content: 'Content for Title 2', date: '2023-09-21' },
        { id: 3, title: 'Title 3', content: 'Content for Title 3', date: '2023-09-20' },
    ];

    const [notifications, setNotifications] = useState(initialNotifications);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setPopupVisible(true);
        setTooltipVisible(false);
    };

    const handleClosePopup = () => {
        setPopupVisible(false);
        setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
        setSelectedNotification(null);
    };

    const handleMarkAsRead = () => {
        handleClosePopup(); // same functionality as close
    };

    return (
        <div className="relative inline-block">
            <button
                className="focus:outline-none"
                onClick={() => setTooltipVisible(!isTooltipVisible)}
            >
                <FaBell className={`size-7 ${notifications.length === 0 ? "text-black" : "text-yellow-400"}`} />
            </button>
            {isTooltipVisible && (
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-2 w-96 bg-white shadow-lg rounded-lg">
                    <div className='p-5 bg-gray-200 rounded-lg shadow-xl'>
                        <ul className="py-2">
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className="px-4 py-2 mt-2 bg-white hover:bg-gray-100 cursor-pointer rounded-lg"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {notification.title}
                                </li>
                            ))}
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
                        <h2 className="text-lg font-bold">{selectedNotification.title}</h2>
                        <p className="mt-2">{selectedNotification.content}</p>
                        <p className="mt-4 text-sm text-gray-500">{selectedNotification.date}</p>
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
