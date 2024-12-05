const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Query {
    getPatients: [Patient!] 
    getPatientAlerts(patientId: ID!): [EmergencyAlert!]
    getPatientDailyLogs(patientId: ID!): [DailyLog!]
<<<<<<< Updated upstream
    getPatientSymptoms(patientId: ID!): [SymptomsChecklist!] # Fetch symptoms
    getMotivationalTips(patientId: ID!): [MotivationalTip!]

=======
    getPatientSymptoms(patientId: ID!): [SymptomsChecklist!] 
>>>>>>> Stashed changes
  }

  type Mutation {
    registerNurse(name: String!, email: String!, password: String!): Nurse
    registerPatient(name: String!, email: String!, password: String!): Patient
    login(email: String!, password: String!): LoginResponse
    
    # Add operations
    addPatientVitalSigns(
      patientId: ID!,
      temperature: Float,
      heartRate: Float,
      bloodPressure: String,
      respiratoryRate: Float
    ): Patient
    addEmergencyAlert(patientId: ID!, message: String!): Patient
    addSymptomsChecklist(patientId: ID!, symptoms: [String!]!): Patient 

    # Update operations
    updateEmergencyAlert(patientId: ID!, alertId: ID!, message: String!): Patient 
    updatePatientSymptoms(patientId: ID!, date: String!, symptoms: [String!]!): Patient 
    updatePatientVitalSigns(
      patientId: ID!,
      logId: ID!,
      temperature: Float,
      heartRate: Float,
      bloodPressure: String,
      respiratoryRate: Float
    ): Patient

    # Delete operations
    deleteEmergencyAlert(patientId: ID!, alertId: ID!): Patient
    deletePatientVitalSigns(patientId: ID!, logId: ID!): Patient
    deletePatientSymptoms(patientId: ID!, date: String!): Patient
    sendMotivationalTip(patientId: ID!, tip: String!): Boolean

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
    symptomsChecklist: [SymptomsChecklist!]
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
    id: ID!
    symptoms: [String!]!
    date: String!
  }

  type LoginResponse {
    userId: ID!
    role: String!
  }
    



type MotivationalTip {
  tip: String
  date: String
}

`);
