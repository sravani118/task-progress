import React, { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaTasks, FaChartLine, FaSignOutAlt, FaEdit, FaTachometerAlt } from "react-icons/fa";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
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

      const res = await api.get('/api/auth/profile');

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

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/tasks');
      const tasks = res.data.tasks || res.data;
      const completedCount = tasks.filter((t) => t.status === "completed").length;
      const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
      
      setStats({
        total: tasks.length,
        todo: tasks.filter((t) => t.status === "todo").length,
        inProgress: tasks.filter((t) => t.status === "inprogress").length,
        completed: completedCount,
        completionRate
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button onClick={handleLogout} className="error-button">Go to Login</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : 'N/A';

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-header-content">
          <h1>My Profile</h1>
          <p>Manage your account and track your progress</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Left Column - User Info */}
        <div className="profile-main-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <FaUserCircle />
            </div>
            <div className="profile-user-info">
              <h2>{user?.name}</h2>
              <p className="profile-email">
                <FaEnvelope /> {user?.email}
              </p>
              <p className="profile-joined">
                <FaCalendarAlt /> Joined {joinedDate}
              </p>
            </div>
          </div>

          <div className="profile-divider"></div>

          <div className="profile-details">
            <h3>Account Information</h3>
            <div className="profile-info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <div className="info-value">
                  <span>{user?.name}</span>
                </div>
              </div>
              <div className="info-item">
                <label>Email Address</label>
                <div className="info-value">
                  <span>{user?.email}</span>
                </div>
              </div>
              <div className="info-item">
                <label>Account Status</label>
                <div className="info-value">
                  <span className="status-badge active">Active</span>
                </div>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <div className="info-value">
                  <span>{joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="profile-stats-section">
          <div className="stats-card">
            <div className="stats-header">
              <FaChartLine />
              <h3>Task Statistics</h3>
            </div>
            <div className="stats-grid">
              <div className="stat-item total">
                <div className="stat-icon">
                  <FaTasks />
                </div>
                <div className="stat-info">
                  <p className="stat-label">Total Tasks</p>
                  <p className="stat-value">{stats.total}</p>
                </div>
              </div>
              <div className="stat-item todo">
                <div className="stat-icon">📋</div>
                <div className="stat-info">avigate 
                  <p className="stat-label">To-Do</p>
                  <p className="stat-value">{stats.todo}</p>
                </div>
              </div>
              <div className="stat-item progress">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <p className="stat-label">In Progress</p>
                  <p className="stat-value">{stats.inProgress}</p>
                </div>
              </div>
              <div className="stat-item completed">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <p className="stat-label">Completed</p>
                  <p className="stat-value">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="completion-card">
            <h3>Completion Rate</h3>
            <div className="completion-circle">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" className="circle-bg" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  className="circle-progress"
                  style={{
                    strokeDasharray: `${stats.completionRate * 3.14} 314`
                  }}
                />
              </svg>
              <div className="completion-percentage">
                <span className="percentage-value">{stats.completionRate}%</span>
                <span className="percentage-label">Complete</span>
              </div>
            </div>
            <p className="completion-text">
              You've completed {stats.completed} out of {stats.total} tasks
            </p>
          </div>

          <div className="activity-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button onClick={() => navigate('/dashboard')} className="quick-action-btn">
                <FaTachometerAlt /> Dashboard
              </button>
              <button onClick={() => navigate('/total-tasks')} className="quick-action-btn">
                📋 My Tasks
              </button>
              <button onClick={() => navigate('/progress')} className="quick-action-btn">
                <FaChartLine /> Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
