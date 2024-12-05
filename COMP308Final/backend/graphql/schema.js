const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Query {
    getPatients: [Patient!] 
    getPatientAlerts(patientId: ID!): [EmergencyAlert!]
    getPatientDailyLogs(patientId: ID!): [DailyLog!]
    getPatientSymptoms(patientId: ID!): [SymptomsChecklist!] # Fetch symptoms
  }

  type Mutation {
    registerNurse(name: String!, email: String!, password: String!): Nurse
    registerPatient(name: String!, email: String!, password: String!): Patient
    login(email: String!, password: String!): LoginResponse
    addPatientVitalSigns(patientId: ID!, temperature: Float, heartRate: Float, bloodPressure: String, respiratoryRate: Float): Patient
    addEmergencyAlert(patientId: ID!, message: String!): Patient
    deleteEmergencyAlert(patientId: ID!, alertId: ID!): Patient
    deletePatientVitalSigns(patientId: ID!, logId: ID!): Patient
    addSymptomsChecklist(patientId: ID!, symptoms: [String!]!): Patient # Add symptoms
    deletePatientSymptoms(patientId: ID!, date: String!): Patient
  }

  type Nurse {
    id: ID!
    name: String!
    email: String!
  }

  type Patient {
    id: ID!
    name: String!
    email: String!
    dailyLogs: [DailyLog!]
    emergencyAlerts: [EmergencyAlert!]
    symptomsChecklist: [SymptomsChecklist!] # Field for symptoms
  }

  type EmergencyAlert {
    id: ID!
    message: String!
    date: String!
  }

  type DailyLog {
    id: ID!
    date: String!
    temperature: Float
    heartRate: Float
    bloodPressure: String
    respiratoryRate: Float
  }

  type SymptomsChecklist {
    symptoms: [String!] # List of symptoms
    date: String! # Date the symptoms were logged
  }

  type LoginResponse {
    userId: ID!
    role: String!
  }
`);
