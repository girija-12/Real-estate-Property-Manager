import React, { useEffect, useState } from "react";
import "./ManageMaintenance.css"; // Import CSS file

const ManageMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-maintenance-requests?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        setRequests(data.maintenanceRequests);
      } catch (error) {
        console.error("Error fetching maintenance requests:", error);
      }
    };

    fetchRequests();
  }, [username]);

  return (
    <div className="manage-maintenance-container">
      <h2>Manage Maintenance Requests</h2>
      <table className="maintenance-table">
        <thead>
          <tr>
            <th>Tenant Name</th>
            <th>Property Name</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={index}>
              <td>{request.tenant_name}</td>
              <td>{request.property_name}</td>
              <td>{request.issue_description}</td>
              <td className={`priority-${request.priority}`}>{request.priority}</td>
              <td>{request.status}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageMaintenance;