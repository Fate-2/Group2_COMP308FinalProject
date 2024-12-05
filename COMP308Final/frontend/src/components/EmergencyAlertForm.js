import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_EMERGENCY_ALERT } from "../graphql/mutations";
import "./EmergencyAlertForm.css";

const EmergencyAlertForm = ({ patientId }) => {
  const [message, setMessage] = useState("");
  const [addEmergencyAlert] = useMutation(ADD_EMERGENCY_ALERT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      alert("Patient ID not found. Please log in again.");
      return;
    }
    try {
      await addEmergencyAlert({ variables: { patientId, message } });
      alert("Emergency alert sent successfully!");
      setMessage("");
    } catch (err) {
      console.error("Error sending emergency alert:", err.message);
      alert("Failed to send emergency alert.");
    }
  };

  return (
    <div className="emergency-alert-container">
      <h4 className="emergency-alert-title">Send Emergency Alert</h4>
      <form onSubmit={handleSubmit} className="emergency-alert-form">
        <textarea
          className="form-control"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your emergency message"
        />
        <button type="submit" className="btn-send-alert">Send Alert</button>
      </form>
    </div>
  );
};

export default EmergencyAlertForm;
