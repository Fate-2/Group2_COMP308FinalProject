import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1 className="homepage-title">Health Monitor App</h1>
        <p className="homepage-subtitle">
          A modern solution for nurses and patients to monitor health effectively.
        </p>
      </header>

      <section className="homepage-content">
        <h2>Explore Our Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>For Nurses</h3>
            <p>
              Manage patient alerts, vital signs, and symptoms efficiently in a single dashboard.
            </p>
          </div>
          <div className="feature-card">
            <h3>For Patients</h3>
            <p>
              Log your health details and stay connected with your healthcare providers.
            </p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Monitoring</h3>
            <p>
              Keep track of health updates and receive emergency notifications instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
