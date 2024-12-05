import React from "react";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <h1 className="display-4">Welcome to HealthMonitorApp</h1>
        <p className="lead">
          A modern solution for nurses and patients to monitor health effectively.
        </p>
        <div className="mt-4">
          <a href="/login" className="btn btn-primary btn-lg mx-2">Login</a>
          <a href="/register" className="btn btn-secondary btn-lg mx-2">Register</a>
        </div>
      </div>
    </>
  );
};

export default HomePage;
