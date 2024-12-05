import { gql } from "@apollo/client";

export const GET_PATIENTS = gql`
  query GetPatients {
    getPatients {
      id
      name
      email
    }
  }
`;

export const GET_PATIENT_ALERTS = gql`
  query GetPatientAlerts($patientId: ID!) {
    getPatientAlerts(patientId: $patientId) {
      id
      message
      date
    }
  }
`;

export const GET_PATIENT_DAILY_LOGS = gql`
  query GetPatientDailyLogs($patientId: ID!) {
    getPatientDailyLogs(patientId: $patientId) {
      id
      date
      temperature
      heartRate
      bloodPressure
      respiratoryRate
    }
  }
`;

export const GET_PATIENT_SYMPTOMS = gql`
  query GetPatientSymptoms($patientId: ID!) {
    getPatientSymptoms(patientId: $patientId) {
      symptoms
      date
    }
  }
`;
