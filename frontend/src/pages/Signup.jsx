import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api";
import { useAuth } from "../components/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signupUser(email, password);

    if (res?.ok === false) {
      setMessage(res.message || "Signup failed");
      return;
    }

    setUser({ email });
    setMessage("Signup successful");
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      <h1>Signup</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button type="submit" style={{ padding: "10px 14px" }}>
          Create account
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}
