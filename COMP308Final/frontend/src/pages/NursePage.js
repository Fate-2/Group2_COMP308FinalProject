import React from "react";
import Navbar from "../components/Navbar";
import NurseDashboard from "../components/NurseDashboard";

const NursePage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <NurseDashboard />
      </div>
    </>
  );
};

export default NursePage;
