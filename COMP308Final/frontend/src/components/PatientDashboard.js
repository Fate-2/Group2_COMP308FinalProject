import React from "react";
import { useQuery } from "@apollo/client";
import { GET_MOTIVATIONAL_TIPS } from "../graphql/queries";
import EmergencyAlertForm from "./EmergencyAlertForm";
import DailyLogForm from "./DailyLogForm";
import SymptomsChecklistForm from "./SymptomsChecklistForm";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const patientId = localStorage.getItem("userId");

  const { data, loading, error } = useQuery(GET_MOTIVATIONAL_TIPS, {
    variables: { patientId },
    skip: !patientId,
  });

  if (!patientId) {
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

      <section className="motivational-tips">
  <h3>Motivational Tips From Your Nurse</h3>
  {loading ? (
    <p className="loading-message">Loading motivational tips...</p>
  ) : error ? (
    <p className="error-message">Error fetching tips: {error.message}</p>
  ) : data?.getMotivationalTips?.length > 0 ? (
    <ul className="tips-list">
      {data.getMotivationalTips.map((tip, index) => (
        <li key={index} className="tip-card">
          <p className="tip-text">"{tip.tip}"</p>
          <p className="tip-date">Sent on: {new Date(tip.date).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="no-tips-message">No motivational tips available at the moment.</p>
  )}
</section>
    </div>
  );
};

export default PatientDashboard;
