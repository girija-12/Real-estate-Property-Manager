import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManageUsers from "./pages/ManageUsers"; // Add this import
import ManageProperties from "./pages/ManageProperties"; // Add this import
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/manager-dashboard"
          element={
            <PrivateRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/tenant-dashboard"
          element={
            <PrivateRoute allowedRoles={["tenant"]}>
              <TenantDashboard />
            </PrivateRoute>
          }
        />

<Route path="/manage-users"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ManageUsers />
            </PrivateRoute>
          }
        />
        
        <Route path="/manage-properties"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <ManageProperties />
            </PrivateRoute>
          }
        />
        
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
