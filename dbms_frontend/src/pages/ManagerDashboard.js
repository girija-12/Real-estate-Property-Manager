import React from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Users, LogOut } from "lucide-react";
import './ManagerDashboard.css';  // Import the custom CSS file

const ManagerDashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Manager Dashboard</h2>
        <nav className="sidebar-nav">
          <Link to="/manager-dashboard" className="sidebar-link">
            <ClipboardList className="icon" /> Manage Properties
          </Link>
          <Link to="/manage-tenants" className="sidebar-link">
            <Users className="icon" /> Manage Tenants
          </Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut className="icon" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="welcome-text">Welcome, Manager</h1>
        <div className="dashboard-cards">
          {/* Dashboard Cards */}
          <div className="card">
            <h3 className="card-title">Total Properties Managed</h3>
            <p className="card-value">30</p>
          </div>
          <div className="card">
            <h3 className="card-title">Active Tenants</h3>
            <p className="card-value">89</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
