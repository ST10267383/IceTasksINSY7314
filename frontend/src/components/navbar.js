import React from "react";
import logo from "../logo.svg";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        <img src={logo} alt="logo" style={{ width: 25, height: 25 }} />
      </NavLink>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">List</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/create">Create Post</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/register">Register</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/login">Login</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}