const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format.");
  }
};

module.exports = {
  registerNurse: async ({ name, email, password }) => {
    if (!name || !email || !password) throw new Error("All fields are required.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const nurse = new Nurse({ name, email, password: hashedPassword });
    await nurse.save();
    return nurse;
  },

  registerPatient: async ({ name, email, password }) => {
    if (!name || !email || !password) throw new Error("All fields are required.");
    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = new Patient({ name, email, password: hashedPassword });
    await patient.save();
    return patient;
  },

  login: async ({ email, password }) => {
    const nurse = await Nurse.findOne({ email });
    if (nurse && (await bcrypt.compare(password, nurse.password))) {
      return { userId: nurse._id, role: "Nurse" };
    }

    const patient = await Patient.findOne({ email });
    if (patient && (await bcrypt.compare(password, patient.password))) {
      return { userId: patient._id, role: "Patient" };
    }

    throw new Error("Invalid credentials.");
  },

  addEmergencyAlert: async ({ patientId, message }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    const emergencyAlert = { message, date: new Date() };
    patient.emergencyAlerts.push(emergencyAlert);
    await patient.save();

    return patient;
  },

  getPatients: async () => {
    return await Patient.find();
  },

  addPatientVitalSigns: async ({ patientId, temperature, heartRate, bloodPressure, respiratoryRate }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    const vitalSigns = { date: new Date(), temperature, heartRate, bloodPressure, respiratoryRate };
    patient.dailyLogs.push(vitalSigns);
    await patient.save();

    return patient;
  },

  deletePatientVitalSigns: async ({ patientId, logId }) => {
    validateObjectId(patientId);
    validateObjectId(logId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    // Find the log to delete
    const logIndex = patient.dailyLogs.findIndex((log) => log._id.toString() === logId);
    if (logIndex === -1) throw new Error("Vital sign log not found.");

    // Remove the log
    patient.dailyLogs.splice(logIndex, 1);
    await patient.save();

    return patient; // Return the updated patient data
},


  getPatientAlerts: async ({ patientId }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    return patient.emergencyAlerts.map((alert) => ({
      id: alert._id.toString(),
      message: alert.message,
      date: alert.date.toISOString(),
    }));
  },

  getPatientDailyLogs: async ({ patientId }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    return patient.dailyLogs.map((log) => ({
      id: log._id.toString(),
      date: log.date.toISOString(),
      temperature: log.temperature,
      heartRate: log.heartRate,
      bloodPressure: log.bloodPressure,
      respiratoryRate: log.respiratoryRate,
    }));
  },
  deleteEmergencyAlert: async ({ patientId, alertId }) => {
    validateObjectId(patientId);
    validateObjectId(alertId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    const alertIndex = patient.emergencyAlerts.findIndex((alert) => alert._id.toString() === alertId);
    if (alertIndex === -1) throw new Error("Alert not found.");

    patient.emergencyAlerts.splice(alertIndex, 1);
    await patient.save();

    return patient;
  },

  addSymptomsChecklist: async ({ patientId, symptoms }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    const symptomsChecklist = { symptoms, date: new Date() };
    if (!patient.symptomsChecklist) {
      patient.symptomsChecklist = []; // Initialize if undefined
    }
    patient.symptomsChecklist.push(symptomsChecklist);
    await patient.save();

    return patient;
  },

  getPatientSymptoms: async ({ patientId }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    return patient.symptomsChecklist.map((entry) => ({
      symptoms: entry.symptoms,
      date: entry.date.toISOString(),
    }));
  },

  deletePatientSymptoms: async ({ patientId, date }) => {
    validateObjectId(patientId);
  
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");
  
    const symptomsIndex = patient.symptomsChecklist.findIndex(
      (entry) => entry.date.toISOString() === date
    );
  
    if (symptomsIndex === -1) throw new Error("Symptoms entry not found.");
  
    patient.symptomsChecklist.splice(symptomsIndex, 1);
    await patient.save();
  
    return patient;
  },

  
  sendMotivationalTip: async ({ patientId, tip }) => {
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");
  
    patient.motivationalTip.push({ tip, date: new Date() });
    await patient.save();
    return true;
  },
  
  getMotivationalTips: async ({ patientId }) => {
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");
  
    return patient.motivationalTip;
  },

};
