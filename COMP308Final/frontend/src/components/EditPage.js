import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmergencyAlertForm from "./EmergencyAlertForm";
import DailyLogForm from "./DailyLogForm";
import SymptomsChecklistForm from "./SymptomsChecklistForm";
import "./EditPage.css";

const EditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingItem = location.state?.editingItem || null;
  const patientId = location.state?.patientId || null;

  console.log("EditPage received:", { editingItem, patientId });

  if (!editingItem || !patientId) {
    alert("Error: Missing required information. Please try again.");
    return (
      <div className="error-message">
        <p>Error: Missing required information. Please try again.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Edit {editingItem.type}</h2>
        <p className="dashboard-subtitle">
          Make changes to the selected {editingItem.type} record below.
        </p>
      </header>

      <section className="form-section">
        {editingItem.type === "alert" && (
          <div className="form-card">
            <h3>Edit Emergency Alert</h3>
            <EmergencyAlertForm
              patientId={patientId}
              alert={editingItem}
              isEditMode={true}
            />
          </div>
        )}

        {editingItem.type === "log" && (
          <div className="form-card">
            <h3>Edit Daily Health Log</h3>
            <DailyLogForm
              patientId={patientId}
              log={editingItem}
              isEditMode={true}
            />
          </div>
        )}

        {editingItem.type === "symptom" && (
          <div className="form-card">
            <h3>Edit Symptoms Checklist</h3>
            <SymptomsChecklistForm
              patientId={patientId}
              symptoms={editingItem}
              isEditMode={true}
            />
          </div>
        )}
      </section>

      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EditPage;
