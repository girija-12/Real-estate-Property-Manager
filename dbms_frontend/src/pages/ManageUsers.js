import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageUsers.css'; // Custom styling

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-users');
      setUsers(response.data.users); // Assuming the API returns { users: [...] }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/delete-user/${userId}`);
      if (response.status === 200) {
        setUsers(users.filter(user => user.user_id !== userId));
        setMessage('User deleted successfully!'); // Set success message
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="manage-users-container">
      <h1>Manage Users</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.user_id)} className="delete-btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;