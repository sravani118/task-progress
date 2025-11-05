import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!form.email.includes("gmail.com")) newErrors.email = "Email must be a Gmail address";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 
        (err?.message === "Network Error" ? "Cannot connect to server. Please try again later." : "Signup failed, try again.");
      alert(errorMessage);
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-logo">
           <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
            alt="logo"
          />
          <h2>TaskProgresser</h2>
        </div>
        <h3>Sign Up</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <input
              name="email"
              type="email"
              placeholder="Email (must be Gmail)"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Password (min. 6 characters)"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit">Sign Up</button>
        </form>

        <div className="auth-alt">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
