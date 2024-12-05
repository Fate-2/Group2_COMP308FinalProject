import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
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
  ANALYZE_SYMPTOMS,
} from "../graphql/mutations";
import "./NurseDashboard.css";

const NurseDashboard = () => {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [motivationalTip, setMotivationalTip] = useState("");
  const [generatedConditions, setGeneratedConditions] = useState([]);

  // Fetch the list of patients
  const { data: patientsData, loading: patientsLoading, error: patientsError } = useQuery(GET_PATIENTS);

  // Fetch alerts for the selected patient
  const { data: alertsData, loading: alertsLoading, refetch: refetchAlerts } = useQuery(GET_PATIENT_ALERTS, {
    variables: { patientId: selectedPatientId },
    skip: !selectedPatientId,
  });

  // Fetch daily logs for the selected patient
  const { data: dailyLogsData, loading: logsLoading, refetch: refetchDailyLogs } = useQuery(GET_PATIENT_DAILY_LOGS, {
    variables: { patientId: selectedPatientId },
    skip: !selectedPatientId,
  });

  // Fetch symptoms for the selected patient
  const { data: symptomsData, loading: symptomsLoading, refetch: refetchSymptoms } = useQuery(GET_PATIENT_SYMPTOMS, {
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

  const [analyzeSymptoms] = useMutation(ANALYZE_SYMPTOMS, {
    onCompleted: (data) => setGeneratedConditions(data.analyzeSymptoms),
  });

  // Handlers
  const handlePatientSelect = (e) => {
    setSelectedPatientId(e.target.value);
  };

  const handleSendTip = async (e) => {
    e.preventDefault();
    if (!motivationalTip.trim()) return alert("Tip cannot be empty.");
    try {
      await sendMotivationalTip({ variables: { patientId: selectedPatientId, tip: motivationalTip } });
      alert("Motivational tip sent!");
      setMotivationalTip("");
    } catch (err) {
      alert(`Failed to send tip: ${err.message}`);
    }
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptomsData?.getPatientSymptoms || symptomsData.getPatientSymptoms.length === 0) {
      return alert("No symptoms data available for analysis.");
    }
    try {
      await analyzeSymptoms({ variables: { patientId: selectedPatientId } });
    } catch (err) {
      alert(`Failed to analyze symptoms: ${err.message}`);
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
                  <p>{alert.message}</p>
                  <p>{new Date(alert.date).toLocaleString()}</p>
                  <button onClick={() => deleteEmergencyAlert({ variables: { patientId: selectedPatientId, alertId: alert.id } })}>
                    Delete
                  </button>
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
                  <p>Temperature: {log.temperature}°C</p>
                  <p>Heart Rate: {log.heartRate}</p>
                  <p>Blood Pressure: {log.bloodPressure}</p>
                  <p>Respiratory Rate: {log.respiratoryRate}</p>
                  <button onClick={() => deletePatientVitalSigns({ variables: { patientId: selectedPatientId, logId: log.id } })}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Symptoms Checklist */}
          <section className="data-section">
            <h4>Symptoms Checklist</h4>
            <div className="card-container">
              {symptomsData?.getPatientSymptoms?.map((symptom) => (
                <div key={symptom.date} className="data-card">
                  <p>{symptom.symptoms.join(", ")}</p>
                  <p>{new Date(symptom.date).toLocaleString()}</p>
                  <button onClick={() => deletePatientSymptoms({ variables: { patientId: selectedPatientId, date: symptom.date } })}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="motivational-tip-section">
            <h4>Send Motivational Tip To This Patient</h4>
             <form className="motivational-tip-form" onSubmit={handleSendTip}>
               <textarea
                className="motivational-textarea"
                placeholder="Write a motivational tip..."
                value={motivationalTip}
                onChange={(e) => setMotivationalTip(e.target.value)}
                required
               />
               <button type="submit" className="motivational-submit-btn">
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
