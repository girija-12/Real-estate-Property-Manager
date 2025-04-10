import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Users, LogOut } from "lucide-react";
import './ManagerDashboard.css';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({ total_properties: 0, active_tenants: 0 });

  useEffect(() => {
    const username = localStorage.getItem("username"); // Get stored username

    if (username) {
      fetch(`http://localhost:5000/manager-dashboard-stats?username=${encodeURIComponent(username)}`)
        .then((res) => res.json())
        .then((data) => {
          setStats({
            total_properties: data.total_properties || 0,
            active_tenants: data.active_tenants || 0,
          });
        })
        .catch((err) => console.error("Error fetching dashboard stats:", err));
    }
  }, []);

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
            <ClipboardList className="icon" /> Dashboard
          </Link>
          <Link to="/manage-properties" className="sidebar-link">
            <ClipboardList className="icon" /> Manage Properties
          </Link>
          <Link to="/manage-tenants" className="sidebar-link">
            <Users className="icon" /> Manage Tenants
          </Link>
          <Link to="/manage-maintenance" className="sidebar-link">
            <ClipboardList className="icon" /> Manage Maintenance Requests
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
          {/* Dashboard Cards - Dynamically Updated */}
          <div className="card">
            <h3 className="card-title">Total Properties Managed</h3>
            <p className="card-value">{stats.total_properties}</p>
          </div>
          <div className="card">
            <h3 className="card-title">Active Tenants</h3>
            <p className="card-value">{stats.active_tenants}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;