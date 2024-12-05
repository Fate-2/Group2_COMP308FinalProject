const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Nurse = require("../models/Nurse");
const Patient = require("../models/Patient");

// Validate MongoDB ObjectId
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

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const emergencyAlert = { message, date: new Date() };
    patient.emergencyAlerts.push(emergencyAlert);
    await patient.save();

    return patient;
  },

  updateEmergencyAlert: async ({ patientId, alertId, message }) => {
    validateObjectId(patientId);
    validateObjectId(alertId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const alert = patient.emergencyAlerts.id(alertId);
    if (!alert) throw new Error("Alert not found.");

    alert.message = message;
    await patient.save();

    return alert;
  },

  addPatientVitalSigns: async ({ patientId, temperature, heartRate, bloodPressure, respiratoryRate, weight }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const vitalSigns = { date: new Date(), temperature, heartRate, bloodPressure, respiratoryRate, weight };
    patient.dailyLogs.push(vitalSigns);
    await patient.save();

    return patient;
  },

  updatePatientVitalSigns: async ({ patientId, logId, temperature, heartRate, bloodPressure, respiratoryRate }) => {
    validateObjectId(patientId);
    validateObjectId(logId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const log = patient.dailyLogs.id(logId);
    if (!log) throw new Error("Log not found.");

    log.temperature = temperature || log.temperature;
    log.heartRate = heartRate || log.heartRate;
    log.bloodPressure = bloodPressure || log.bloodPressure;
    log.respiratoryRate = respiratoryRate || log.respiratoryRate;

    await patient.save();

    return log;
  },

  deletePatientVitalSigns: async ({ patientId, logId }) => {
    validateObjectId(patientId);
    validateObjectId(logId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const logIndex = patient.dailyLogs.findIndex((log) => log._id.toString() === logId);
    if (logIndex === -1) throw new Error("Vital sign log not found.");

    patient.dailyLogs.splice(logIndex, 1);
    await patient.save();

    return patient;
  },

  addSymptomsChecklist: async ({ patientId, symptoms }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const symptomsChecklist = { symptoms, date: new Date() };
    patient.symptomsChecklist.push(symptomsChecklist);
    await patient.save();

    return patient;
  },

  updatePatientSymptoms: async ({ patientId, date, symptoms }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const symptomEntry = patient.symptomsChecklist.find(
      (entry) => entry.date.toISOString() === date
    );

    if (!symptomEntry) throw new Error("Symptom entry not found.");

    symptomEntry.symptoms = symptoms;
    await patient.save();

    return symptomEntry;
  },

  deletePatientSymptoms: async ({ patientId, date }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    const symptomsIndex = patient.symptomsChecklist.findIndex(
      (entry) => entry.date.toISOString() === date
    );

    if (symptomsIndex === -1) throw new Error("Symptoms entry not found.");

    patient.symptomsChecklist.splice(symptomsIndex, 1);
    await patient.save();

    return patient;
  },

  getPatientSymptoms: async ({ patientId }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    return patient.symptomsChecklist.map((entry) => ({
      symptoms: entry.symptoms,
      date: entry.date.toISOString(),
    }));
  },

  getPatientDailyLogs: async ({ patientId }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(ObjectId(patientId));
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

  getPatientAlerts: async ({ patientId }) => {
    validateObjectId(patientId);

    const patient = await Patient.findById(ObjectId(patientId));
    if (!patient) throw new Error("Patient not found.");

    return patient.emergencyAlerts.map((alert) => ({
      id: alert._id.toString(),
      message: alert.message,
      date: alert.date.toISOString(),
    }));
  },

  sendMotivationalTip: async ({ patientId, tip }) => {
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    if (!patient.motivationalTips) patient.motivationalTips = [];
    patient.motivationalTips.push({ tip, date: new Date() });
    await patient.save();

    return true;
  },

  getMotivationalTips: async ({ patientId }) => {
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found.");

    return patient.motivationalTips || [];
  },
};
