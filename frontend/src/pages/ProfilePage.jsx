import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login again.");
        setIsLoading(false);
        return;
      }

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        setError("User information not found. Please login again.");
        setIsLoading(false);
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || "https://task-progress-backend.onrender.com";
      const res = await axios.get(`${apiUrl}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please try again later.");
      } else {
        setError("An error occurred while fetching your profile. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-card error">
          <p className="error-text">{error}</p>
          <button onClick={handleLogout} className="primary-button">Go to Login</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-card loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        <div className="profile-info">
          <div className="profile-field">
            <label>Name</label>
            <p>{user.name}</p>
          </div>
          <div className="profile-field">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
