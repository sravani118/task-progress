import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <header className="home-header">
        <div className="home-logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
            alt="logo"
            className="home-logo-icon"
          />
          <h2>TaskProgresser</h2>
        </div>

        <nav className="home-nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <h1>
            <span className="blue">Plan.</span>{" "}
            <span className="purple">Track.</span>{" "}
            <span className="green">Finish.</span>
          </h1>
          <p>
            The easiest way to manage your To-Do, In Progress, and Completed
            tasks — all in one clean dashboard.
          </p>
          <button
            className="get-started-btn"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>

        <div className="overview-card">
          <h3>Task Overview</h3>
          <div className="overview-buttons">
            <button className="btn-todo">To-Do</button>
            <button className="btn-progress">In Progress</button>
            <button className="btn-complete">Completed</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features" id="features">
        <div className="feature-box">
          <h4>Create Tasks</h4>
          <p>Add and organize your tasks with deadlines and priorities.</p>
        </div>
        <div className="feature-box">
          <h4>Track Progress</h4>
          <p>Stay on top of your goals by tracking task completion easily.</p>
        </div>
        <div className="feature-box">
          <h4>Visual Dashboard</h4>
          <p>View all your activities at a glance with progress insights.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        © 2025 TaskProgesser — Simplify Your Workflow
      </footer>
    </div>
  );
};

export default HomePage;
