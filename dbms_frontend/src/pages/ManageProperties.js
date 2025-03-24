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

  // Edit property state
  const [editProperty, setEditProperty] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  // Handle form submit (Add Property)
  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/add-property", {
        ...newProperty,
        username: localStorage.getItem("username"),
      });

      if (response.status === 200) {
        setSuccessMessage("Property added successfully!");
        setError("");
        fetchProperties(); // Refresh properties
        setTimeout(() => setSuccessMessage(""), 3000);
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

  // Handle Edit Button Click
  const handleEditClick = (property) => {
    setEditProperty(property);
    setShowEditModal(true);
  };

  // Handle Property Update
  const handleUpdateProperty = async () => {
    if (!editProperty) return;
  
    try {
      const response = await axios.put(
        `http://localhost:5000/update-property/${editProperty.id}`,  // Ensure correct ID
        editProperty
      );
  
      if (response.status === 200) {
        setSuccessMessage("Property updated successfully!");
        setShowEditModal(false);
        fetchProperties(); // Refresh list after update
      }
    } catch (error) {
      setError("Failed to update property");
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

        <button type="submit" className="add-btn">Add Property</button>
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
            <tr key={property.property_id}>
              <td>{property.title}</td>
              <td>{property.address}</td>
              <td>{property.price}</td>
              <td>{property.property_type}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(property)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Property Modal */}
      {showEditModal && editProperty && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Property</h2>
            <input
              type="text"
              value={editProperty.title}
              onChange={(e) => setEditProperty({ ...editProperty, title: e.target.value })}
            />
            <input
              type="text"
              value={editProperty.address}
              onChange={(e) => setEditProperty({ ...editProperty, address: e.target.value })}
            />
            <input
              type="number"
              value={editProperty.price}
              onChange={(e) => setEditProperty({ ...editProperty, price: e.target.value })}
            />
            <select
              value={editProperty.property_type}
              onChange={(e) => setEditProperty({ ...editProperty, property_type: e.target.value })}
            >
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
            </select>
            <button onClick={handleUpdateProperty} className="update-btn">Update</button>
            <button onClick={() => setShowEditModal(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProperties;