import React, { useEffect, useState } from "react";
import "./ManageTenants.css"; // Import CSS file

const ManageTenants = () => {
  const [tenants, setTenants] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-tenants?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        setTenants(data.tenants);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };

    fetchTenants();
  }, [username]);

  return (
    <div className="manage-tenants-container">
      <h2>Manage Tenants</h2>
      <table className="tenants-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Property Name</th>
            <th>Lease Start</th>
            <th>Lease End</th>
            <th>Rent Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant, index) => (
            <tr key={index}>
              <td>{tenant.full_name}</td>
              <td>{tenant.email}</td>
              <td>{tenant.property_name}</td>
              <td>{tenant.lease_start_date}</td>
              <td>{tenant.lease_end_date}</td>
              <td>${tenant.rent_amount}</td>
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

export default ManageTenants;