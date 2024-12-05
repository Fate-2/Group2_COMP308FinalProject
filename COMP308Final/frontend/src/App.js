import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Register from "./components/Register";
import NurseDashboard from "./components/NurseDashboard";
import PatientDashboard from "./components/PatientDashboard";
import EditPage from "./components/EditPage"; 
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/nurse-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Nurse"]}>
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-page"
          element={
            <ProtectedRoute allowedRoles={["Nurse"]}>
              <EditPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
