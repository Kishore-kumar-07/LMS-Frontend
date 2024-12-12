import { Html, Head, Body, Text, Button, Img } from "@react-email/components";
import PropTypes from 'prop-types';
const EmailTemplate = ({
  empId,
  leaveType,
  fromDate,
  toDate,
  leaveReason,
  userName,
  imageUrl,
  fromDay,
  toDay,
  leaveId,
  noOfLOP,
  leaveDescription,
  totalLeave
}) => 
  
  (
  <Html>
    <Head />
    <Body
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Img
        src={imageUrl}
        alt="Company Logo"
        style={{ width: "100px", marginBottom: "20px" }}
      />
      <h1 style={{ color: "#333", fontSize: "24px" }}>
        Leave Request from {userName} with id {empId}
      </h1>
      <Text style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}>
        Hi Manager,
      </Text>
      <Text style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}>
        You have received a new leave request. Please find the details below:
      </Text>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <tr>
          <td
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            Leave Type:
          </td>
          <td style={{ padding: "10px", backgroundColor: "#fff" }}>
            {leaveType}
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            From Date:
          </td>

          <td style={{ padding: "10px", backgroundColor: "#fff" }}>
            <div>{fromDate}</div>
            <td style={{ padding: "10px", backgroundColor: "#fff" }}>
              {fromDay}
            </td>
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            To Date:
          </td>
          <td style={{ padding: "10px", backgroundColor: "#fff" }}>
            <div>{toDate}</div>
            <td style={{ padding: "10px", backgroundColor: "#fff" }}>
              {toDay}
            </td>
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            Total Leave:
          </td>
          <td style={{ padding: "10px", backgroundColor: "#fff" }}>{totalLeave}</td>
        </tr>
        <tr>
          <td
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            Number of LOP:
          </td>
          <td style={{ padding: "10px", backgroundColor: "#fff" }}>{noOfLOP}</td>
        </tr>
        <tr>
          <td
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            Reason:
          </td>
          <td style={{ padding: "10px", backgroundColor: "#fff" }}>
            {leaveReason}
          </td>
        </tr>
        <tr>
          <td
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontWeight: "bold",
            }}
          >
            Reason for Leave:
          </td>
          <td style={{ padding: "10px", backgroundColor: "#fff" }}>
            {leaveDescription}
          </td>
        </tr>
      </table>
      <Text style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}>
        Kindly review and respond to this leave request.
      </Text>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          pX={20}
          pY={10}
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
            marginRight: "10px",
            padding: "10px",
          }}
          href={`${process.env.REACT_APP_BASE_URL}/leave/accept/${leaveId}`}
        >
          Accept
        </Button>
        <Button
          pX={20}
          pY={10}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "5px",
            padding: "10px",
          }}
          href={`${process.env.REACT_APP_BASE_URL}/leave/deny/${leaveId}`}
        >
          Decline
        </Button>
      </div>
    </Body>
  </Html>
);

EmailTemplate.propTypes = {
  empId: PropTypes.string.isRequired,
  leaveType: PropTypes.string.isRequired,
  fromDate: PropTypes.string.isRequired,
  toDate: PropTypes.string.isRequired,
  leaveReason: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  fromDay: PropTypes.string.isRequired,
  toDay: PropTypes.string.isRequired,
  leaveId: PropTypes.string.isRequired,
  noOfLOP: PropTypes.number.isRequired,
  leaveDescription: PropTypes.string.isRequired,
  totalLeave: PropTypes.number.isRequired,
};

export default EmailTemplate;
