import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      role
    }
  }
`;

export const REGISTER_NURSE = gql`
  mutation RegisterNurse($name: String!, $email: String!, $password: String!) {
    registerNurse(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const REGISTER_PATIENT = gql`
  mutation RegisterPatient($name: String!, $email: String!, $password: String!) {
    registerPatient(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

export const ADD_DAILY_LOG = gql`
  mutation addDailyLog(
  $patientId: ID!,
  $temperature: Float,
  $heartRate: Float,
  $bloodPressure: String,
  $respiratoryRate: Float,
  $weight: Float
) {
  addDailyLog(
    patientId: $patientId,
    temperature: $temperature,
    heartRate: $heartRate,
    bloodPressure: $bloodPressure,
    respiratoryRate: $respiratoryRate,
    weight: $weight
  ) {
    id
    dailyLogs {
      date
      temperature
      heartRate
      bloodPressure
      respiratoryRate
      weight
    }
  }
}
`;



export const ADD_PATIENT_VITAL_SIGNS = gql`
  mutation addPatientVitalSigns(
    $patientId: ID!,
    $temperature: Float,
    $heartRate: Float,
    $bloodPressure: String,
    $respiratoryRate: Float
  ) {
    addPatientVitalSigns(
      patientId: $patientId,
      temperature: $temperature,
      heartRate: $heartRate,
      bloodPressure: $bloodPressure,
      respiratoryRate: $respiratoryRate
    ) {
      dailyLogs {
        date
        temperature
        heartRate
        bloodPressure
        respiratoryRate
      }
    }
  }
`;

export const DELETE_PATIENT_VITAL_SIGNS = gql`
  mutation deletePatientVitalSigns($patientId: ID!, $logId: ID!) {
    deletePatientVitalSigns(patientId: $patientId, logId: $logId) {
      dailyLogs {
        id
        date
        temperature
        heartRate
        bloodPressure
        respiratoryRate
      }
    }
  }
`;


export const ADD_EMERGENCY_ALERT = gql`
  mutation addEmergencyAlert($patientId: ID!, $message: String!) {
    addEmergencyAlert(patientId: $patientId, message: $message) {
      emergencyAlerts {
        message
        date
      }
    }
  }
`;

export const ADD_SYMPTOMS_CHECKLIST = gql`
  mutation addSymptomsChecklist($patientId: ID!, $symptoms: [String!]!) {
    addSymptomsChecklist(patientId: $patientId, symptoms: $symptoms) {
      symptomsChecklist {
        symptoms
        date
      }
    }
  }
`;


export const DELETE_PATIENT_SYMPTOMS = gql`
  mutation DeletePatientSymptoms($patientId: ID!, $date: String!) {
    deletePatientSymptoms(patientId: $patientId, date: $date) {
      symptomsChecklist {
        symptoms
        date
      }
    }
  }
`;


export const EDIT_DAILY_LOG = gql`
  mutation editDailyLog($patientId: ID!, $logId: ID!, $temperature: Float, $heartRate: Float, $bloodPressure: String, $respiratoryRate: Float) {
    editDailyLog(patientId: $patientId, logId: $logId, temperature: $temperature, heartRate: $heartRate, bloodPressure: $bloodPressure, respiratoryRate: $respiratoryRate) {
      dailyLogs {
        id
        date
        temperature
        heartRate
        bloodPressure
        respiratoryRate
      }
    }
  }
`;
export const DELETE_DAILY_LOG = gql`
  mutation deleteDailyLog($patientId: ID!, $logId: ID!) {
    deleteDailyLog(patientId: $patientId, logId: $logId) {
      dailyLogs {
        id
      }
    }
  }
`;

export const DELETE_EMERGENCY_ALERT = gql`
  mutation deleteEmergencyAlert($patientId: ID!, $alertId: ID!) {
    deleteEmergencyAlert(patientId: $patientId, alertId: $alertId) {
      emergencyAlerts {
        id
        message
        date
      }
    }
  }
`;