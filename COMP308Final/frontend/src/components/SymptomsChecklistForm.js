import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_SYMPTOMS_CHECKLIST } from "../graphql/mutations";
import "./SymptomsChecklistForm.css";

const SymptomsChecklistForm = ({ patientId }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [addSymptomsChecklist] = useMutation(ADD_SYMPTOMS_CHECKLIST);

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSymptoms([...symptoms, e.target.value]);
    } else {
      setSymptoms(symptoms.filter((symptom) => symptom !== e.target.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientId) {
      alert("Patient ID not found. Please log in again.");
      return;
    }

    try {
      await addSymptomsChecklist({ variables: { patientId, symptoms } });
      alert("Symptoms checklist submitted successfully!");
      setSymptoms([]);
    } catch (err) {
      console.error("Error submitting symptoms checklist:", err.message);
      alert("Failed to submit symptoms checklist.");
    }
  };

  return (
    <div className="symptoms-checklist-container">
      <h3 className="symptoms-checklist-title">Symptoms Checklist</h3>
      <form onSubmit={handleSubmit} className="symptoms-checklist-form">
        <label>
          <input
            type="checkbox"
            value="Fever"
            onChange={handleCheckboxChange}
          />{" "}
          Fever
        </label>
        <label>
          <input
            type="checkbox"
            value="Cough"
            onChange={handleCheckboxChange}
          />{" "}
          Cough
        </label>
        <label>
          <input
            type="checkbox"
            value="Shortness of Breath"
            onChange={handleCheckboxChange}
          />{" "}
          Shortness of Breath
        </label>
        <label>
          <input
            type="checkbox"
            value="Fatigue"
            onChange={handleCheckboxChange}
          />{" "}
          Fatigue
        </label>
        <button type="submit" className="btn-submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SymptomsChecklistForm;
