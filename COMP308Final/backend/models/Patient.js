const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dailyLogs: [
    {
      date: { type: Date, default: Date.now },
      temperature: Number,
      heartRate: Number,
      bloodPressure: String,
      respiratoryRate: Number,
      weight: Number,
    },
  ],


  
  symptomsChecklist: [
    {
      symptoms: [String],
      date: Date,
    },
  ],
  emergencyAlerts: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now }, // Ensure this is configured correctly
    },
  ],
});

module.exports = mongoose.model("Patient", PatientSchema);
