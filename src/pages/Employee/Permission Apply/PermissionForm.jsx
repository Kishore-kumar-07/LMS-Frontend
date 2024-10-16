import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ConfirmPermission from "./ConfrimPermission";
import duration from "dayjs/plugin/duration";
import { render } from "@react-email/render";
import PermissionEmailTemplate from "./PermissionTemplate";
import { DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import PermissionDetailTable from "./PermissionDetailsTable";
import { CURRENT_STATUS } from "../../../statusIndicator";
import { OrbitProgress } from "react-loading-indicators";
dayjs.extend(duration);

const PermissionForm = () => {
  const navigation = useNavigate();
  const navigate = useNavigate();
  const [toTime, setToTime] = useState(dayjs().add(1, "hour"));
  const [permissionDate, setPermissionDate] = useState(null);
  const [permissionReason, setPermissionReason] = useState("");
  const [isPermission, setIsPermission] = useState(false);
  const [amPm, setAmPm] = useState("");
  const [classfalse, setclassfalse] = useState("");
  const [errors, setErrors] = useState({
    permissionDate: false,
    permissionReason: false,
  }); // New state for errors
  const [checkStatus, setCheckStatus] = useState(CURRENT_STATUS.IDEAL);
  const [applyStatus, setApplyStatus] = useState(CURRENT_STATUS.IDEAL);

  const token = document.cookie.split("=")[1];

  console.log(token);
  const decodedToken = jwtDecode(token);
  console.log("in", decodedToken.empId);

  const [fromTime, setFromTime] = useState(
    dayjs().isBetween(
      dayjs().startOf("day").hour(9),
      dayjs().startOf("day").hour(17)
    )
      ? dayjs()
      : dayjs().hour(9)
  );

  const isTimeExceeding = () => {
    const timeDifference = dayjs.duration(toTime.diff(fromTime)).asHours();
    console.log("time Difference", timeDifference);
    return timeDifference > 2;
  };

  const shouldDisableDate = (date) => {
    const today = dayjs();
    const dayOfWeek = today.day();

    // Allow today and tomorrow
    const isToday = date.isSame(today, "day");
    const isTomorrow = date.isSame(today.add(1, "day"), "day");

    // If today is Friday, allow Monday (two days after tomorrow)
    const isMonday = dayOfWeek === 5 && date.isSame(today.add(3, "day"), "day"); // 3 days from Friday to Monday

    // Disable weekends (Saturday and Sunday)
    const isWeekend = date.day() === 0 || date.day() === 6;

    return isWeekend || !(isToday || isTomorrow || isMonday);
  };

  // Handle fromTime change
  const handleFromTimeChange = (newTime) => {
    const minTime = dayjs().startOf("day").hour(9);
    const maxTime = dayjs().startOf("day").hour(17);

    // Restrict fromTime to be between 9 AM and 5 PM
    if (newTime.isBefore(minTime)) {
      setFromTime(minTime);
    } else if (newTime.isAfter(maxTime)) {
      setFromTime(maxTime);
    } else {
      setFromTime(newTime);
    }
  };

  // Update toTime when fromTime changes
  useEffect(() => {
    const minToTime = fromTime.add(1, "hour");
    const maxToTime = fromTime.add(2, "hours");

    if (toTime.isBefore(minToTime)) {
      setToTime(minToTime);
    } else if (toTime.isAfter(maxToTime)) {
      setToTime(maxToTime);
    }
  }, [fromTime]);

  const applyPermission = async (e) => {
    console.log("permission");
    try {
      if (isTimeExceeding()) {
        toast.error("Time limit Exceeded");
      } else {
        console.log(
          "Permession Sendttttt",
          typeof dayjs.duration(toTime.diff(fromTime)).asHours()
        );
        setApplyStatus(CURRENT_STATUS.LOADING);
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/permission/apply`,
          {
            empId: decodedToken.empId,
            hrs: dayjs.duration(toTime.diff(fromTime)).asHours().toFixed(1),
            reason: permissionReason,
            date: formatDate(permissionDate),
            from: fromTime.format("hh:mm A"),
            to: toTime.format("hh:mm A"),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setApplyStatus(CURRENT_STATUS.SUCCESS);
        if (res.status === 201) {
          toast.success("Requested Permission Successfully");
          var data = res.data;
          console.log("data", data.permission._id);
          sendPermissionEmail(data.permission._id);
          // sendPermissionEmail(data.permission._id);
        } else if (res.status === 203) {
          toast.error("Insufficient Permission Balance");
        }
      }
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
      console.error("Error permission Apply", error);
      toast.error("Error is requesting Permission");
    } finally {
      console.log("per end");
      setIsPermission(!isPermission);
    }
  };

  const checkPermission = async () => {
    if (!validateFields()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (fromTime && toTime && permissionDate) {
      setclassfalse("");
      try {
        setCheckStatus(CURRENT_STATUS.LOADING);
        const res = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/permission/checkPermission`,
          {
            empId: decodedToken.empId,
            date: formatDate(permissionDate),
            hrs: dayjs.duration(toTime.diff(fromTime)).asHours(),
            session: {
              firstHalf: amPm === "AM" ? true : false,
              secondHalf: amPm === "PM" ? true : false,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCheckStatus(CURRENT_STATUS.SUCCESS);
        if (res.status === 202) {
          toast.error("The Permission Time is Already Applied");
        } else if (res.status === 203) {
          toast.warning("The Permission Time is Already Applied");
        } else {
          setIsPermission(!isPermission);
        }
      } catch (error) {
        if (error.response.status === 400) {
          navigation("/error404");
        }
        if (error.response.status === 500) {
          navigation("/error500");
        }
        toast.error("Something went wrong");
      }
    } else {
      setclassfalse("false");
      setIsPermission(false);
    }
  };

  const validateFields = () => {
    const newErrors = {
      permissionDate: permissionDate === null,
      permissionReason: permissionReason.trim() === "",
    };

    setErrors(newErrors);
    return !newErrors.permissionDate && !newErrors.permissionReason; // Return true if there are no errors
  };

  console.log("checiittt", decodedToken.managerMail);
  const sendPermissionEmail = async (objId) => {
    const emailContent = await render(
      <PermissionEmailTemplate
        date={formatDate(permissionDate)}
        fromTime={fromTime.format("hh:mm A")}
        toTime={toTime.format("hh:mm A")}
        permissionReason={permissionReason}
        userName={decodedToken.empName}
        imageUrl="https://www.gilbarco.com/us/sites/gilbarco.com.us/files/2022-07/gilbarco_logo.png"
        permissionId={objId}
      />
    );

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/mail/send`,
        {
          email: decodedToken.managerMail,
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
        setTimeout(() => {
          navigate("/thank-you");
        }, 3000);
      } else {
        toast.error("error in sending mail");
      }
    } catch (error) {
      if (error.response.status === 400) {
        navigation("/error404");
      }
      if (error.response.status === 500) {
        navigation("/error500");
      }
      console.error(
        "Error sending email:",
        error.response ? error.response.data : error.message
      );
      toast.error("error in sending mail");
    }
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format("DD/MM/YYYY") : "";
  };

  return (
    <>
      <div className="w-[50%] h-fit shadow-xl p-10 flex flex-col gap-6 bg-gradient-to-l from-[#DAF0FF] to-white ">
        <ToastContainer />
        <h1 className="text-2xl text-center font-bold w-full mb-5">
          Permission Form
        </h1>

        <div className="w-[50%]">
          <label
            className={`${
              errors.permissionDate ? "text-red-500" : "text-black"
            } block text-gray-700 mb-1 font-bold text-lg`}
          >
            {errors.permissionDate
              ? "Please select a date *"
              : "Permission Date"}
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={permissionDate}
              onChange={(newValue) => setPermissionDate(newValue)}
              shouldDisableDate={(date) => {
                const today = dayjs();
                const currentMonth = today.month();
                const day = date.day();
                return (
                  day === 0 ||
                  day === 6 ||
                  date.isBefore(today, "day") ||
                  date.month() !== currentMonth
                );
              }}
              renderInput={(params) => (
                <input
                  {...params.inputProps}
                  className={`w-[150%] border ${
                    errors.permissionDate ? "border-red-500" : "border-gray-300"
                  } rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500`}
                  placeholder="Select Permission Date"
                />
              )}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex w-full gap-10 ">
            <MobileTimePicker
              label="From Time"
              value={fromTime}
              onChange={(newValue) => {
                setFromTime(newValue);
                const amOrPm = newValue.format("A");
                setAmPm(amOrPm);
              }}
              minTime={dayjs().set("hour", 9).set("minute", 0)}
              maxTime={dayjs().set("hour", 17).set("minute", 0)}
              renderInput={(params) => <TextField {...params} />}
            />
            <MobileTimePicker
              label="To Time"
              value={toTime}
              minTime={fromTime.add(1, "hour")}
              maxTime={fromTime.add(2, "hour")}
              onChange={(newValue) => setToTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>

        <div className="w-[80%]">
          <label
            className={`${
              errors.permissionReason ? "text-red-500" : "text-black"
            } block text-gray-700 mb-1 font-bold text-lg`}
          >
            {errors.permissionReason
              ? "Reason is required *"
              : "Reason for permission"}
          </label>
          <textarea
            placeholder="Reason for permission"
            className={`resize-none border-2 w-[100%] p-2 ${
              errors.permissionReason ? "border-red-500" : "border-gray-300"
            }`}
            rows={3}
            onChange={(e) => setPermissionReason(e.target.value)}
          />
        </div>

        {checkStatus === CURRENT_STATUS.LOADING ? (
          <div className="flex justify-center">
            <OrbitProgress
              variant="track-disc"
              color="#078ebc"
              size="small"
              text="Wait"
              textColor=""
            />
          </div>
        ) : (
          <div>
            <button
              className="p-3 bg-blue-500 rounded-lg w-40 "
              onClick={checkPermission}
            >
              Submit
            </button>
          </div>
        )}

        {isPermission && (
          <ConfirmPermission
            hours={dayjs.duration(toTime.diff(fromTime)).asHours().toFixed(2)}
            reason={permissionReason}
            fromTime={fromTime.format("hh:mm A")}
            toTime={toTime.format("hh:mm A")}
            permissionDate={formatDate(permissionDate)}
            employeeName={decodedToken.empName}
            onClose={setIsPermission}
            applyPermission={applyPermission}
            status={applyStatus}
          />
        )}
      </div>
    </>
  );
};

export default PermissionForm;
