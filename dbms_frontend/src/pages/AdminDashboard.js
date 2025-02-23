import React from "react";
import { Link } from "react-router-dom";
import { BarChart, Users, Home, LogOut } from "lucide-react";
import './AdminDashboard.css';  // Import the custom CSS file

const AdminDashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Dashboard</h2>
        <nav className="sidebar-nav">
          <Link to="/admin-dashboard" className="sidebar-link">
            <BarChart className="icon" /> Dashboard
          </Link>
          <Link to="/manage-users" className="sidebar-link">
            <Users className="icon" /> Manage Users
          </Link>
          <Link to="/manage-properties" className="sidebar-link">
            <Home className="icon" /> Manage Properties
          </Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut className="icon" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="welcome-text">Welcome, Admin</h1>
        <div className="dashboard-cards">
          {/* Dashboard Cards */}
          <div className="card">
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">256</p>
          </div>
          <div className="card">
            <h3 className="card-title">Properties Managed</h3>
            <p className="card-value">120</p>
          </div>
          <div className="card">
            <h3 className="card-title">Pending Approvals</h3>
            <p className="card-value">5</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
