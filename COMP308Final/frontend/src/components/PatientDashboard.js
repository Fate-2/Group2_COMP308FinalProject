import React from "react";
import EmergencyAlertForm from "./EmergencyAlertForm";
import DailyLogForm from "./DailyLogForm";
import SymptomsChecklistForm from "./SymptomsChecklistForm";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const patientId = localStorage.getItem("userId");

  if (!patientId) {
    alert("Error: Patient ID not found. Please log in again.");
    return (
      <div className="error-message">
        <p>Error: Patient ID not found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Patient Dashboard</h2>
        <p className="dashboard-subtitle">
          Keep track of your health and stay connected with your nurse.
        </p>
      </header>

      <section className="form-section">
        <div className="form-card">
          <h3>Emergency Alert</h3>
          <EmergencyAlertForm patientId={patientId} />
        </div>

        <div className="form-card">
          <h3>Daily Health Log</h3>
          <DailyLogForm patientId={patientId} />
        </div>

        <div className="form-card">
          <h3>Symptoms Checklist</h3>
          <SymptomsChecklistForm patientId={patientId} />
        </div>
      </section>
    </div>
  );
};

export default PatientDashboard;
