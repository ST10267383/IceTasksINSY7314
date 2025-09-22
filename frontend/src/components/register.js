import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "https://localhost:3001";

export default function Register() {
  const [form, setForm] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  function updateForm(value) {
    setForm(prev => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Signup failed");
        return;
      }

      // clear and go to login
      setForm({ name: "", password: "" });
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Could not reach the server.");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h3>Register</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="form-control"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            type="text"
            autoComplete="username"
            required
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="form-control"
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        <input className="btn btn-primary" type="submit" value="Create user" />
      </form>
    </div>
  );
}