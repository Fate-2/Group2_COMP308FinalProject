import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import Navbar component
import { REGISTER_NURSE, REGISTER_PATIENT } from "../graphql/mutations";

const Register = () => {
  const [role, setRole] = useState("nurse");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [registerNurse] = useMutation(REGISTER_NURSE);
  const [registerPatient] = useMutation(REGISTER_PATIENT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === "nurse") {
        await registerNurse({ variables: { name, email, password } });
      } else {
        await registerPatient({ variables: { name, email, password } });
      }
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);
      alert("Registration failed.");
    }
  };

  return (
    <>
      <Navbar /> {/* Add Navbar */}
      <div className="container mt-5">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="nurse">Nurse</option>
              <option value="patient">Patient</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
