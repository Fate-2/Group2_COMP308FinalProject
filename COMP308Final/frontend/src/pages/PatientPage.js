import React from "react";
import Navbar from "../components/Navbar";
import PatientDashboard from "../components/PatientDashboard";

const PatientPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <PatientDashboard />
      </div>
    </>
  );
};

export default PatientPage;
