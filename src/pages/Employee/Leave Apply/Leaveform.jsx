import React, { useState } from "react";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { render } from "@react-email/render";
import "react-toastify/dist/ReactToastify.css";
import LeaveNotification from "./LeaveNotification";
import EmailTemplate from "./EmailTemplate";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { CURRENT_STATUS } from "../../../statusIndicator";
import { OrbitProgress } from "react-loading-indicators";

const getMinDate = () => {
  const today = dayjs();
  const dayOfWeek = today.day(); // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

  if (dayOfWeek === 1) {
    // If today is Monday, set minDate to last Friday
    return today.subtract(3, "day");
  } else {
    // Otherwise, set minDate to yesterday
    return today.subtract(1, "day");
  }
};

const Leaveform = ({ isPaternity,isAdoption }) => {
  const navigate = useNavigate();
  const [classfalse, setclassfalse] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isHalfDayFrom, setIsHalfDayFrom] = useState(false);
  const [isHalfDayTo, setIsHalfDayTo] = useState(false);
  const [fromHalf, setFromHalf] = useState("");
  const [toHalf, setToHalf] = useState("");
  const [leaveReason, setLeaveReason] = useState("Personal");
  const [leaveDescription, setLeaveDescription] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [leaveDetails, setLeaveDetails] = useState({});
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [summary, setSummary] = useState("");
  const [isLOP, setIsLOP] = useState(false);
  const [fromFirstHalf, setFromFirstHalf] = useState(false);
  const [toFirstHalf, setToFirstHalf] = useState(false);
  const [fromSecondHalf, setFromSecondHalf] = useState(false);
  const [toSecondHalf, setToSecondHalf] = useState(false);
  const [today, setToday] = useState(dayjs().subtract(1, "day"));
  const [lopStatus, setLopStatus] = useState(CURRENT_STATUS.IDEAL);
  const [confirmStatus, setConfirmStatus] = useState(CURRENT_STATUS.IDEAL);
  // const [isAppliedLeave, setIsAppliedLeave] = useState(false);

  const token = document.cookie.split("=")[1];
  console.log(token);
  const decodedToken = jwtDecode(token);
  console.log("in", decodedToken.empId);

  const formatDate = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "";
  };

  const maxDate = today.add(1, "month").endOf("month");

  const shouldDisableDate = (date) => {
    return date.day() === 0 || date.day() === 6;
  };

  const shouldDisableToDate = (date) => {
    if (!fromDate) return false;
    return (
      date.day() === 0 || date.day() === 6 || date.month() !== fromDate.month()
    );
  };

  const handleLOP = () => {
    setIsLOP(!isLOP);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    console.log("Cancelled!");
    setIsLOP(!isLOP);
    setLopStatus(CURRENT_STATUS.IDEAL)

    setPopupVisible(!popupVisible);
  };

  const checkLeave = async () => {
    console.log("Check Leave");
    try {
      setLopStatus(CURRENT_STATUS.LOADING)
      const res = await axios.post(
       ` ${process.env.REACT_APP_BASE_URL}/leave/checkLeave`,
        {
          empId: decodedToken.empId,
          role: decodedToken.role,
          leaveType: leaveType,
          from: {
            date: formatDate(fromDate),
            firstHalf: fromFirstHalf,
            secondHalf: fromSecondHalf,
          },
          numberOfDays: totalDays,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLopStatus(CURRENT_STATUS.SUCCESS)

      if (res.status === 202) {
        toast.error("Date is Already Applied");
      } else {
        setSummary(res.data);
        handleLOP();
      }
    } catch (e) {
      toast.error("Somthing went wrong");
    }
  };

  const calculateLeaveDays = () => {
    if (!fromDate || !toDate) return 0;

    // Convert Day.js objects to native JavaScript Date objects
    const fromDateObj = dayjs(fromDate).toDate();
    const toDateObj = dayjs(toDate).toDate();

    // Initialize total days to 0
    let adjustedDays = 0;

    // Loop through each day between fromDate and toDate
    let currentDate = new Date(fromDateObj);

    while (currentDate <= toDateObj) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

      // Check if the current day is a weekday (Monday to Friday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Exclude Sundays (0) and Saturdays (6)
        adjustedDays++;
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Adjust for half days
    if (isHalfDayFrom) adjustedDays -= 0.5;
    if (isHalfDayTo) adjustedDays -= 0.5;

    return adjustedDays;
  };

  var totalDays = calculateLeaveDays();

  const handleConfirm = async () => {


    try {
      console.log(
        "LOP",
        fromFirstHalf,
        fromSecondHalf,
        toFirstHalf,
        toSecondHalf
      );

      setConfirmStatus(CURRENT_STATUS.LOADING)
      const res = await axios.post(
       ` ${process.env.REACT_APP_BASE_URL}/leave/apply`,
        {
          empId: decodedToken.empId,
          empName: decodedToken.empName,
          role: decodedToken.role,
          leaveType: leaveType,
          from: {
            date: formatDate(fromDate),
            firstHalf: fromFirstHalf,
            secondHalf: fromSecondHalf,
          },
          to: {
            date: formatDate(toDate),
            firstHalf: toFirstHalf,
            secondHalf: toSecondHalf,
          },
          numberOfDays:
            leaveType === "Casual Leave"
              ? summary.CL 
              : leaveType === "privilege Leave"
              ? summary.PL
              : summary.Paternity,
          reasonType: leaveReason,
          reason: leaveReason === "Others" ? leaveDescription : leaveReason,
          LOP: summary.LOP,
          leaveDays:   leaveType === "Casual Leave"
          ? summary.CL + summary.LOP
          : leaveType === "privilege Leave"
          ? summary.PL + summary.LOP
          : summary.Paternity + summary.LOP,
        },
        {
          headers: {
            Authorization:` Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      setConfirmStatus(CURRENT_STATUS.SUCCESS);

      console.log("ksdhfgiyrsgbrwnh");
      if (res.status === 201) {
        setIsLOP(!isLOP);
        setPopupVisible(!popupVisible);
        toast.success("Leave Appliled Successfully");
        console.log(res.data.leave._id);
        sendLeaveEmail(res.data.leave._id, summary.LOP);
      } else {
        setConfirmStatus(CURRENT_STATUS.ERROR);

        toast.error("Error in requesting Leave");
      }

      var data = res.data;
      console.log(data.leave._id);

      // console.log("data", res.data);
    } catch (error) {
      console.error("Error Leave Apply", error);
      toast.error("Error in Applying Leave");
    } finally {
      // setIsAppliedLeave(!isAppliedLeave);
      // setIsLOP(!isLOP);
    }
  };
  var fromDay = !isHalfDayFrom ? "FullDay" : "Half Day";
  var toDay = formatDate(fromDate) == formatDate(toDate) ? fromDay : !isHalfDayTo ? "FullDay" : "Half day";

  const sendLeaveEmail = async (objId, LOP) => {
    const emailContent = await render(
      <EmailTemplate
        empId={decodedToken.empId}
        leaveType={leaveType}
        fromDate={formatDate(fromDate)}
        toDate={formatDate(toDate)}
        leaveReason={leaveReason}
        fromDay={fromDay}
        toDay={toDay}
        userName={decodedToken.empName}
        imageUrl="https://www.gilbarco.com/us/sites/gilbarco.com.us/files/2022-07/gilbarco_logo.png"
        leaveId={objId}
        noOfLOP={LOP}
        totalLeave={
          leaveType === "Casual Leave"
          ? summary.CL + summary.LOP
          : leaveType === "privilege Leave"
          ? summary.PL + summary.LOP
          : summary.Paternity + summary.LOP
        }
        leaveDescription={
          leaveReason === "Others" ? leaveDescription : leaveReason
        }
      />
    );

    try {
      const response = await axios.post(
       `${process.env.REACT_APP_BASE_URL}/mail/send`,
        {
          email: "mohammedashif.a2022cse@sece.ac.in",
          html: emailContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Mail sent Successfully");
        // setTimeout(() => {
          navigate("/thank-you");
        // }, 3000);
      } else {
        toast.error("Error in sending Email");
      }
    } catch (error) {
      console.error(
        "Error sending email:",
        error.response ? error.response.data : error.message
      );
      alert("Error sending email");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (leaveType === "Privilege Leave" && totalDays < 3) {
      toast.warn("Privilege Leave must be minimum of 3 days");
    } else if (fromDate && toDate) {
      setPopupVisible(true);

      // Use a function inside setState to ensure the latest state is used.
      setclassfalse(() => ""); // Reset classfalse
    } else {
      console.log("classfalse", classfalse);

      setclassfalse(() => "false"); // Set it to "false" correctly
      setPopupVisible(false);
    }
    const halfDayInfo = {
      fromHalf: isHalfDayFrom ? fromHalf : "Full Day",
      toHalf: isHalfDayTo ? toHalf : "Full Day",
    };

    setLeaveDetails({
      fromDate: fromDate ? formatDate(fromDate) : "",
      toDate: toDate ? formatDate(toDate) : "",
      leaveReason,
      leaveDescription:
        leaveReason === "Others" ? leaveDescription : leaveReason,
      totalDays,
      halfDayInfo,
      leaveType,
    });

    // setPopupVisible(true);
  };

  const handleFromDayTypeChange = (type) => {
    setIsHalfDayFrom(type === "half");
  };

  const handleToDayTypeChange = (type) => {
    setIsHalfDayTo(type === "half");
  };

  const handleLeaveReasonChange = (reason) => {
    setLeaveReason(reason);
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  return (
    <div className="w-[70%]  md:w-[50%] py-8  border-2 rounded-lg bg-gradient-to-l from-[#DAF0FF] to-white shadow-xl flex flex-col justify-center items-center">
      <ToastContainer />
      <h2 className="text-4xl font-bold mb-4 text-center text-blue-800">
        Leave Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 justify-center items-center w-full px-4"
      >
        {/* Leave Type */}
        <div className="w-full mb-4">
          <label className="block mb-2 text-xl font-bold">
            Leave Type *
          </label>
          <div className="flex gap-4 flex-wrap">
            {[
              "Casual Leave",
              decodedToken.role === "GVR" && "Privilege Leave",
              isPaternity && "Paternity Leave",
              isAdoption && "Adoption Leave"
            ].map(
              (type) =>
                type && (
                  <label key={type} className="flex items-center text-lg">
                    <input
                      type="radio"
                      name="leaveType"
                      value={type}
                      checked={leaveType === type}
                      onChange={() => setLeaveType(type)}
                      className="mr-2"
                    />
                    {type}
                  </label>
                )
            )}
          </div>
        </div>
        

        {/* From Date */}
        <div className="w-full mb-4 flex flex-wrap gap-4 items-center  ">
          <div className="w-[30%]">
            <label
              className={`${
                !toDate && classfalse !== "" ? "text-red-500" : "text-black"
              } block mb-2 text-lg`}
            >
              {toDate && classfalse === "" ? (
                <div className = "font-bold">From Date </div>
              ) : (
                <div className = "font-bold"> From Date*</div>
              )}
            </label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={fromDate}
                onChange={(newValue) => {
                  setFromDate(newValue);
                  setToDate(newValue); // Sync 'toDate' with 'fromDate'
                }}
                shouldDisableDate={shouldDisableDate}
                minDate={today}
                maxDate={maxDate}
                renderInput={(params) => (
                  <input
                    {...params.inputProps}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                    placeholder="Select From Date"
                  />
                )}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </div>

          {/* Half/Full Day From */}
          <div className="flex gap-4 mt-7">
            <button
              type="button"
              onClick={() => handleFromDayTypeChange("full")}
              className={`h-14 px-6 font-semibold  rounded-md ${
                !isHalfDayFrom ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Full Day
            </button>
            <button
              type="button"
              onClick={() => handleFromDayTypeChange("half")}
              className={`h-14 px-6 font-semibold  rounded-md ${
                isHalfDayFrom ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Half Day
            </button>
          </div>

          {/* First/Second Half From */}
          {isHalfDayFrom && (
            <div className="flex gap-4 mt-8 text-lg">
              {[toHalf!=="First Half"&&"First Half", "Second Half"].map((half) => (
                <label key={half} className="flex items-center">
                  <input
                    type="radio"
                    name="halfDayFrom"
                    value={half}
                    checked={fromHalf === half}
                    onChange={() => {
                      if (half === "First Half") {
                        setFromFirstHalf(true);
                        setToFirstHalf(false);
                        if(fromDate != toDate) {
                            setToDate(fromDate);
                            
                        }
                      }
                      if (half === "Second Half") {
                        setFromFirstHalf(false);
                        setToFirstHalf(true);
                      }
                      setFromHalf(half);
                    }}
                    className="mr-2"
                  />
                  {half}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* To Date */}
        <div className="w-full mb-4 flex flex-wrap gap-4 items-center">
          <div className="w-[30%]">
            <label
              className={`${
                !toDate && classfalse !== "" ? "text-red-500" : "text-black"
              } block mb-2 text-lg`}
            >
              {toDate && classfalse === "" ? (
                <div className = "font-bold">To Date </div>
              ) : (
                <div className = "font-bold">To Date*</div>
              )}
            </label>{" "}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                shouldDisableDate={shouldDisableToDate}
                minDate={fromDate || today}
                maxDate={maxDate}
                renderInput={(params) => (
                  <input
                    {...params.inputProps}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring"
                    placeholder="Select To Date"
                  />
                )}
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          </div>

          {/* Half/Full Day To */}
          <div className="flex gap-4 mt-7">
            <button
              type="button"
              onClick={() => handleToDayTypeChange("full")}
              className={`h-14 px-6 font-semibold  rounded-md ${
                !isHalfDayTo || formatDate(toDate)==formatDate(fromDate) ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Full Day
            </button>
           
         { formatDate(toDate)!=formatDate(fromDate) && <button
              type="button"
              onClick={() => handleToDayTypeChange("half")}
              className={`h-14 px-6 font-semibold  rounded-md ${
                isHalfDayTo ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Half Day
            </button>}
          </div>

          {/* First/Second Half To */}
          {isHalfDayTo && formatDate(toDate)!=formatDate(fromDate) && (
            <div className="flex gap-4 mt-8 text-lg">
              {["First Half"].map((half) => (
                <label key={half} className="flex items-center ">
                  <input
                    type="radio"
                    name="halfDayTo"
                    value={half}
                    checked={toHalf === half}
                    onChange={() => {
                    
                      if (half === "First Half") {
                        setFromSecondHalf(true);
                        setToSecondHalf(false);
                      }
                      if (half === "Second Half") {
                        setFromSecondHalf(false);
                        setToSecondHalf(true);
                      }
                      setToHalf(half);
                    }}
                    className="mr-2"
                  />
                  {half}
                </label>
              ))}
            </div>
          )}
        </div>

     

        {/* Leave Reason */}
        <div className="w-full mb-4">
          <label className="block font-bold mb-2 text-lg">
            Leave Reason* 
          </label>
          <div className="flex gap-4 flex-wrap text-lg">
            {[
              "Personal",
              "Medical",
              "Paternity",
              "Family Function",
              "Others",
            ].map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="leaveReason"
                  value={reason}
                  checked={leaveReason === reason}
                  onChange={() => handleLeaveReasonChange(reason)}
                  className="mr-2"
                />
                {reason}
              </label>
            ))}
          </div>
        </div>
        {/* Leave Description */}
        {leaveReason === "Others" && (
          <div className="w-full flex items-center mb-3">
            <label className="block text-black font-bold mb-2 text-lg mr-5">
              Leave Description
            </label>
            <textarea
              value={leaveDescription}
              onChange={(e) => setLeaveDescription(e.target.value)}
              className="w-[50%] p-3 border rounded-md resize-none"
              rows="2"
              placeholder="Enter a description of your leave"
            ></textarea>
          </div>
        )}
      
        <button
          type="submit"
          className="w-44 bg-blue-500 text-white p-3 rounded-md text-xl font-bold shadow-lg"
        >
          Submit
        </button>
      </form>

      {/* Popup for Leave Details */}

      {popupVisible && !(lopStatus === CURRENT_STATUS.SUCCESS) && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] flex flex-col justify-center border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-800">Leave Details</h3>
        <button
          className="text-red-500 text-xl font-bold hover:text-red-700 transition-colors"
          onClick={handlePopupClose}
        >
          X
        </button>
      </div>

      {lopStatus === CURRENT_STATUS.LOADING ? (
        <div className="flex justify-center p-20">
          <OrbitProgress
            variant="track-disc"
            color="#078ebc"
            size="small"
            text="Wait"
            textColor=""
          />
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <table className="w-[90%] text-left text-lg border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold text-gray-600">Leave Type</td>
                <td className="border border-gray-300 p-2">{leaveDetails.leaveType}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold text-gray-600">From Date</td>
                <td className="border border-gray-300 p-2">{leaveDetails.fromDate}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold text-gray-600">To Date</td>
                <td className="border border-gray-300 p-2">{leaveDetails.toDate}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold text-gray-600">Number of Days</td>
                <td className="border border-gray-300 p-2">{leaveDetails.totalDays}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold text-gray-600">Leave Reason</td>
                <td className="border border-gray-300 p-2">{leaveDetails.leaveReason}</td>
              </tr>
              {leaveDetails.leaveDescription && (
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold text-gray-600">Leave Description</td>
                  <td className="border border-gray-300 p-2">{leaveDetails.leaveDescription}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pt-5 flex justify-center items-center">
        {lopStatus === CURRENT_STATUS.IDEAL && (
          <button
            className="bg-green-500 w-[100px] text-white font-semibold py-2 rounded-md hover:bg-green-600 transition-colors"
            onClick={checkLeave}
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  </div>
)}

      {isLOP && (
        <LeaveNotification
          totalLeaveDays={totalDays}
          casualLeaveDays={
            leaveType === "Casual Leave"
              ? summary.CL
              : leaveType === "privilege Leave"
              ? summary.PL
              : summary.Paternity
          }
          lopDays={summary.LOP}
          setLopStatus = {setLopStatus}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          status = {confirmStatus}
        />
      )}
    </div>
  );
};

export default Leaveform;