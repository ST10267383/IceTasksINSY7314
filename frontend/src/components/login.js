import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE || "https://localhost:3001";

export default function Login() {
  const [form, setForm] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  function updateForm(value) {
    setForm(prev => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data?.message || "Authentication failed");
        return;
      }

      // Save token (and name if you want it later)
      localStorage.setItem("jwt", data.token);
      if (data.name) localStorage.setItem("name", data.name);

      // clear and go home
      setForm({ name: "", password: "" });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Could not reach the server.");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h3>Login</h3>
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
            autoComplete="current-password"
            required
          />
        </div>

        <input className="btn btn-primary" type="submit" value="Login" />
      </form>
    </div>
  );
}