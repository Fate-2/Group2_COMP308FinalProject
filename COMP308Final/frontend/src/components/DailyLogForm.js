import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PATIENT_VITAL_SIGNS, UPDATE_PATIENT_VITAL_SIGNS } from "../graphql/mutations";
import "./VitalSignsForm.css";

const DailyLogForm = ({ patientId, log, isEditMode }) => {
  const [formData, setFormData] = useState({
    temperature: "",
    heartRate: "",
    bloodPressure: "",
    respiratoryRate: "",
  });

  const [addPatientVitalSigns] = useMutation(ADD_PATIENT_VITAL_SIGNS);
  const [updatePatientVitalSigns] = useMutation(UPDATE_PATIENT_VITAL_SIGNS);

  useEffect(() => {
    if (isEditMode && log) {
      setFormData({
        temperature: log.temperature || "",
        heartRate: log.heartRate || "",
        bloodPressure: log.bloodPressure || "",
        respiratoryRate: log.respiratoryRate || "",
      });
    }
  }, [isEditMode, log]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await updatePatientVitalSigns({
          variables: {
            patientId,
            logId: log.id,
            temperature: parseFloat(formData.temperature),
            heartRate: parseFloat(formData.heartRate),
            bloodPressure: formData.bloodPressure,
            respiratoryRate: parseFloat(formData.respiratoryRate),
          },
        });
        alert("Vital signs updated successfully!");
      } else {
        await addPatientVitalSigns({
          variables: {
            patientId,
            temperature: parseFloat(formData.temperature),
            heartRate: parseFloat(formData.heartRate),
            bloodPressure: formData.bloodPressure,
            respiratoryRate: parseFloat(formData.respiratoryRate),
          },
        });
        alert("Vital signs added successfully!");
      }
    } catch (err) {
      console.error("Error submitting vital signs:", err);
      alert("Failed to submit vital signs. Please check your input and try again.");
    }
  };

  return (
    <div className="daily-log-form-container">
      <h3 className="form-title">{isEditMode ? "Edit Vital Signs" : "Log Vital Signs"}</h3>
      <form onSubmit={handleSubmit} className="daily-log-form">
        <input
          type="text"
          name="temperature"
          placeholder="Temperature (°C)"
          value={formData.temperature}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="heartRate"
          placeholder="Heart Rate (bpm)"
          value={formData.heartRate}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="bloodPressure"
          placeholder="Blood Pressure (e.g., 120/80)"
          value={formData.bloodPressure}
          onChange={handleChange}
          className="form-input"
        />
        <input
          type="text"
          name="respiratoryRate"
          placeholder="Respiratory Rate (breaths/min)"
          value={formData.respiratoryRate}
          onChange={handleChange}
          className="form-input"
        />
        <button type="submit" className="form-submit-button">
          {isEditMode ? "Save Changes" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DailyLogForm;
