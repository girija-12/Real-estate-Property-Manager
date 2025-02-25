import React, { useState, useEffect } from 'react';
import './ManageProperties.css';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    price: '',
    type: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-properties');
      const data = await response.json();
      setProperties(data.properties);  // Assuming response contains properties
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleAddProperty = async () => {
    try {
      const response = await fetch('http://localhost:5000/add-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProperty)
      });
      if (response.ok) {
        fetchProperties();  // Refresh properties list
        setNewProperty({ name: '', address: '', price: '', type: '' }); // Clear form
      } else {
        console.log('Failed to add property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <div className="manage-properties-container">
      <h1>Manage Properties</h1>
      <div className="add-property-form">
        <input
          type="text"
          placeholder="Property Name"
          value={newProperty.name}
          onChange={e => setNewProperty({ ...newProperty, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={newProperty.address}
          onChange={e => setNewProperty({ ...newProperty, address: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProperty.price}
          onChange={e => setNewProperty({ ...newProperty, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Type"
          value={newProperty.type}
          onChange={e => setNewProperty({ ...newProperty, type: e.target.value })}
        />
        <button onClick={handleAddProperty} className="add-btn">Add Property</button>
      </div>
      <table className="properties-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Price</th>
            <th>Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(property => (
            <tr key={property.id}>
              <td>{property.name}</td>
              <td>{property.address}</td>
              <td>{property.price}</td>
              <td>{property.type}</td>
              <td>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProperties;
