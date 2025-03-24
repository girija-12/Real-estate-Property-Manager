import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, FileText, Wrench, LogOut } from "lucide-react";
import "./TenantDashboard.css";

const TenantDashboard = () => {
  const [rent, setRent] = useState("Loading...");
  const [leaseDetails, setLeaseDetails] = useState(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [newRequest, setNewRequest] = useState("");
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const username = localStorage.getItem("username");

  // Fetch rent on component mount
  useEffect(() => {
    fetch(`http://localhost:5000/get-rent?username=${username}`)
      .then((res) => res.json())
      .then((data) => setRent(data.rent))
      .catch((err) => console.error("Error fetching rent:", err));
  }, [username]);

  // Fetch lease details
  const fetchLeaseDetails = () => {
    fetch(`http://localhost:5000/get-lease?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        setLeaseDetails(data);
        setShowLeaseModal(true);
      })
      .catch((err) => console.error("Error fetching lease details:", err));
  };

  // Fetch maintenance requests
  const fetchMaintenanceRequests = () => {
    fetch(`http://localhost:5000/get-maintenance?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        setMaintenanceRequests(data.requests);
        setShowMaintenanceModal(true);
      })
      .catch((err) => console.error("Error fetching maintenance requests:", err));
  };

  // Submit new maintenance request
  const handleAddRequest = () => {
    if (!newRequest.trim()) return;

    fetch("http://localhost:5000/add-maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, request: newRequest }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMaintenanceRequests([...maintenanceRequests, { request: newRequest, status: "Pending" }]);
        setNewRequest(""); // Clear input field
      })
      .catch((err) => console.error("Error adding maintenance request:", err));
  };

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
            <Home className="icon" /> Dashboard
          </Link>
          <Link to="#" onClick={fetchLeaseDetails} className="sidebar-link">
            <FileText className="icon" /> Lease Details
          </Link>
          <Link to="#" onClick={fetchMaintenanceRequests} className="sidebar-link">
            <Wrench className="icon" /> Maintenance Requests
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
            <p className="card-value">${rent}/month</p>
          </div>
        </div>
      </main>

      {/* Lease Details Modal */}
      {showLeaseModal && leaseDetails && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Lease Details</h2>
            <p><strong>Property:</strong> {leaseDetails.property}</p>
            <p><strong>Start Date:</strong> {leaseDetails.start_date}</p>
            <p><strong>End Date:</strong> {leaseDetails.end_date}</p>
            <button onClick={() => setShowLeaseModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Maintenance Requests Modal */}
      {showMaintenanceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Maintenance Requests</h2>

            {/* Add new maintenance request */}
            <div className="request-form">
              <input
                type="text"
                placeholder="Describe your issue..."
                value={newRequest}
                onChange={(e) => setNewRequest(e.target.value)}
              />
              <button onClick={handleAddRequest}>Submit</button>
            </div>

            {/* Scrollable Maintenance Requests List */}
            <div className="maintenance-requests-container">
              {maintenanceRequests.length > 0 ? (
                maintenanceRequests.map((request, index) => (
                  <div key={index} className="request-item">
                    <p><strong>Issue:</strong> {request.request}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                  </div>
                ))
              ) : (
                <p>No maintenance requests found.</p>
              )}
            </div>

            <button onClick={() => setShowMaintenanceModal(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TenantDashboard;