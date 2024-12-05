import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PATIENT_VITAL_SIGNS } from "../graphql/mutations";
import "./VitalSignsForm.css"; // Add a CSS file for styling

const VitalSignsForm = () => {
  const [formData, setFormData] = useState({
    temperature: "",
    heartRate: "",
    bloodPressure: "",
    respiratoryRate: "",
  });

  const [addPatientVitalSigns] = useMutation(ADD_PATIENT_VITAL_SIGNS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const patientId = localStorage.getItem("userId");

    if (!patientId) {
      alert("No patient ID found. Please log in again.");
      return;
    }

    try {
      await addPatientVitalSigns({
        variables: {
          patientId,
          temperature: parseFloat(formData.temperature),
          heartRate: parseFloat(formData.heartRate),
          bloodPressure: formData.bloodPressure,
          respiratoryRate: parseFloat(formData.respiratoryRate),
        },
      });

      alert("Vital signs submitted successfully!");
      setFormData({
        temperature: "",
        heartRate: "",
        bloodPressure: "",
        respiratoryRate: "",
      });
    } catch (err) {
      console.error("Error submitting vital signs:", err);
      alert("Failed to submit vital signs.");
    }
  };

  return (
    <div className="vital-signs-form-container">
      <h3 className="form-title">Log Vital Signs</h3>
      <form onSubmit={handleSubmit} className="vital-signs-form">
        <input
          type="text"
          name="temperature"
          placeholder="Temperature"
          value={formData.temperature}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="heartRate"
          placeholder="Heart Rate"
          value={formData.heartRate}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="bloodPressure"
          placeholder="Blood Pressure"
          value={formData.bloodPressure}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="respiratoryRate"
          placeholder="Respiratory Rate"
          value={formData.respiratoryRate}
          onChange={handleChange}
          className="form-input"
        />
        <button type="submit" className="form-submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default VitalSignsForm;
