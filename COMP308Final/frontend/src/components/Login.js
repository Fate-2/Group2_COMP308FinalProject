import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });

      if (data?.login?.userId) {
        localStorage.setItem("userId", data.login.userId);
        localStorage.setItem("role", data.login.role);
        alert("Login successful!");
        navigate(data.login.role === "Patient" ? "/patient-dashboard" : "/nurse-dashboard");
      } else {
        alert("Invalid login credentials.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
