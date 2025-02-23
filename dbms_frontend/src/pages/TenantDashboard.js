import React from "react";
import { Link } from "react-router-dom";
import { Home, FileText, Wrench, LogOut } from "lucide-react";
import './TenantDashboard.css';  // Import the custom CSS file

const TenantDashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Tenant Dashboard</h2>
        <nav className="sidebar-nav">
          <Link to="/tenant-dashboard" className="sidebar-link">
            <Home className="icon" /> My Property
          </Link>
          <Link to="/view-lease" className="sidebar-link">
            <FileText className="icon" /> Lease Details
          </Link>
          <Link to="/maintenance-request" className="sidebar-link">
            <Wrench className="icon" /> Maintenance Request
          </Link>
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut className="icon" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="welcome-text">Welcome, Tenant</h1>
        <div className="dashboard-cards">
          <div className="card">
            <h3 className="card-title">Your Current Rent</h3>
            <p className="card-value">$1200/month</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TenantDashboard;
