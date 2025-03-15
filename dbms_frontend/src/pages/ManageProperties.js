import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageProperties.css";

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Property form state
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    property_type: "",
    manager_id: "",
  });

  // Fetch properties and user role on component mount
  useEffect(() => {
    fetchProperties();
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("user_id");

    setUserRole(storedRole);
    setUserId(storedUserId);

    if (storedRole === "manager") {
      setNewProperty((prev) => ({ ...prev, manager_id: storedUserId }));
    }
  }, []);

  // Fetch properties
  const fetchProperties = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        setError("No username found in localStorage");
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/get-properties?username=${encodeURIComponent(
          username
        )}`
      );
      setProperties(response.data.properties);
    } catch (error) {
      setError("Error fetching properties");
      console.error(error);
    }
  };

  // Handle form submit
  const handleAddProperty = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/add-property", {
        title: newProperty.title,
        description: newProperty.description,
        address: newProperty.address,
        price: newProperty.price,
        property_type: newProperty.property_type,
        manager_id: newProperty.manager_id,
        username: localStorage.getItem("username"),
      });

      if (response.status === 200) {
        setSuccessMessage("Property added successfully!");
        setError("");
        fetchProperties(); // Refresh properties
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        setNewProperty({
          title: "",
          description: "",
          address: "",
          price: "",
          property_type: "",
          manager_id: userRole === "manager" ? userId : "",
        });
      }
    } catch (error) {
      setError("Failed to add property");
      console.error(error);
    }
  };

  return (
    <div className="manage-properties-container">
      <h1>Manage Properties</h1>

      {/* Error and success messages */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Add Property Form */}
      <form onSubmit={handleAddProperty} className="add-property-form">
        <input
          type="text"
          placeholder="Property Name"
          value={newProperty.title}
          onChange={(e) =>
            setNewProperty({ ...newProperty, title: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProperty.description}
          onChange={(e) =>
            setNewProperty({ ...newProperty, description: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={newProperty.address}
          onChange={(e) =>
            setNewProperty({ ...newProperty, address: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProperty.price}
          onChange={(e) =>
            setNewProperty({ ...newProperty, price: e.target.value })
          }
          required
        />
        {/* Dropdown for Property Type */}
        <select
          value={newProperty.property_type}
          onChange={(e) =>
            setNewProperty({ ...newProperty, property_type: e.target.value })
          }
          required
        >
          <option value="commercial">Commercial</option>
          <option value="residential">Residential</option>
        </select>

        {/* Manager ID Field (Only for Admins) */}
        {userRole === "admin" && (
          <input
            type="number"
            placeholder="Manager ID"
            value={newProperty.manager_id}
            onChange={(e) =>
              setNewProperty({ ...newProperty, manager_id: e.target.value })
            }
          />
        )}

        <button type="submit" className="add-btn">
          Add Property
        </button>
      </form>

      {/* Properties Table */}
      <table className="properties-table">
        <thead>
          <tr>
            <th>Property Name</th>
            <th>Address</th>
            <th>Price</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.address}</td>
              <td>{property.price}</td>
              <td>{property.property_type}</td>
              <td>
                <button className="edit-btn"> Edit </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProperties;