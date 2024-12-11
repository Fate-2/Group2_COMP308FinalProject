import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import {
  GET_PATIENTS,
  GET_PATIENT_ALERTS,
  GET_PATIENT_DAILY_LOGS,
  GET_PATIENT_SYMPTOMS,
} from "../graphql/queries";
import {
  DELETE_PATIENT_VITAL_SIGNS,
  DELETE_EMERGENCY_ALERT,
  DELETE_PATIENT_SYMPTOMS,
  SEND_MOTIVATIONAL_TIP,
} from "../graphql/mutations";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [motivationalTip, setMotivationalTip] = useState(""); // State for motivational tips
  const navigate = useNavigate();

  // Fetch the list of patients
  const { data: patientsData, loading: patientsLoading } = useQuery(GET_PATIENTS);

  // Fetch alerts for the selected patient
  const { data: alertsData, refetch: refetchAlerts } = useQuery(GET_PATIENT_ALERTS, {
    variables: { patientId: selectedPatientId },
    skip: !selectedPatientId,
  });

  // Fetch daily logs for the selected patient
  const { data: dailyLogsData, refetch: refetchDailyLogs } = useQuery(GET_PATIENT_DAILY_LOGS, {
    variables: { patientId: selectedPatientId },
    skip: !selectedPatientId,
  });

  // Fetch symptoms for the selected patient
  const { data: symptomsQueryData, refetch: refetchSymptoms } = useQuery(GET_PATIENT_SYMPTOMS, {
    variables: { patientId: selectedPatientId },
    skip: !selectedPatientId,
  });

  // Mutations
  const [deleteEmergencyAlert] = useMutation(DELETE_EMERGENCY_ALERT, {
    onCompleted: refetchAlerts,
  });

  const [deletePatientVitalSigns] = useMutation(DELETE_PATIENT_VITAL_SIGNS, {
    onCompleted: refetchDailyLogs,
  });

  const [deletePatientSymptoms] = useMutation(DELETE_PATIENT_SYMPTOMS, {
    onCompleted: refetchSymptoms,
  });

  const [sendMotivationalTip] = useMutation(SEND_MOTIVATIONAL_TIP);

  // Handlers
  const handlePatientSelect = (e) => {
    setSelectedPatientId(e.target.value);
  };

  const handleDeleteAlert = (alertId) => {
    deleteEmergencyAlert({ variables: { patientId: selectedPatientId, alertId } });
  };

  const handleDeleteLog = (logId) => {
    deletePatientVitalSigns({ variables: { patientId: selectedPatientId, logId } });
  };

  const handleDeleteSymptoms = (symptomDate) => {
    deletePatientSymptoms({ variables: { patientId: selectedPatientId, date: symptomDate } });
  };

  const handleEdit = (item) => {
    navigate("/edit-page", { state: { editingItem: item, patientId: selectedPatientId } });
  };

  const handleSendMotivationalTip = async (e) => {
    e.preventDefault();
    try {
      await sendMotivationalTip({ variables: { patientId: selectedPatientId, tip: motivationalTip } });
      alert("Motivational Tip sent successfully!");
      setMotivationalTip(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending motivational tip:", error);
      alert("Failed to send motivational tip.");
    }
  };

  return (
    <div className="nurse-dashboard">
      <header className="dashboard-header">
        <h2 className="dashboard-title">Nurse Dashboard</h2>
        <p className="dashboard-subtitle">Manage your patients' health data effectively.</p>
      </header>

      <div className="form-section">
        <label>Select Patient:</label>
        <select className="form-control" value={selectedPatientId} onChange={handlePatientSelect}>
          <option value="">Select a patient</option>
          {patientsLoading && <option>Loading patients...</option>}
          {patientsData?.getPatients?.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPatientId && (
        <>
          {/* Emergency Alerts */}
          <section className="data-section">
            <h4>Emergency Alerts</h4>
            <div className="card-container">
              {alertsData?.getPatientAlerts?.map((alert) => (
                <div key={alert.id} className="data-card">
                  <h5>Alert</h5>
                  <p>{alert.message}</p>
                  <p>{new Date(alert.date).toLocaleString()}</p>
                  <button onClick={() => handleDeleteAlert(alert.id)}>Delete</button>
                  <button onClick={() => handleEdit({ ...alert, type: "alert" })}>Edit</button>
                </div>
              ))}
            </div>
          </section>

          {/* Vital Signs */}
          <section className="data-section">
            <h4>Vital Signs</h4>
            <div className="card-container">
              {dailyLogsData?.getPatientDailyLogs?.map((log) => (
                <div key={log.id} className="data-card">
                  <h5>{new Date(log.date).toLocaleString()}</h5>
                  <p>Temperature: {log.temperature}°C</p>
                  <p>Heart Rate: {log.heartRate}</p>
                  <p>Blood Pressure: {log.bloodPressure}</p>
                  <p>Respiratory Rate: {log.respiratoryRate}</p>
                  <button onClick={() => handleDeleteLog(log.id)}>Delete</button>
                  <button onClick={() => handleEdit({ ...log, type: "log" })}>Edit</button>
                </div>
              ))}
            </div>
          </section>

          {/* Symptoms Checklist */}
          <section className="data-section">
            <h4>Symptoms Checklist</h4>
            <div className="card-container">
              {symptomsQueryData?.getPatientSymptoms?.map((symptom) => (
                <div key={symptom.date} className="data-card">
                  <h5>{new Date(symptom.date).toLocaleString()}</h5>
                  <p>{symptom.symptoms.join(", ")}</p>
                  <button onClick={() => handleDeleteSymptoms(symptom.date)}>Delete</button>
                  <button onClick={() => handleEdit({ ...symptom, type: "symptom" })}>Edit</button>
                </div>
              ))}
            </div>
          </section>

          {/* Send Motivational Tip */}
          <section className="data-section">
            <h4>Send Motivational Tip</h4>
            <form onSubmit={handleSendMotivationalTip}>
              <div className="form-group">
                <label htmlFor="motivationalTip">Motivational Tip</label>
                <textarea
                  id="motivationalTip"
                  className="form-control"
                  rows="3"
                  value={motivationalTip}
                  onChange={(e) => setMotivationalTip(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-danger">
                Send Tip
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
};

export default NurseDashboard;
