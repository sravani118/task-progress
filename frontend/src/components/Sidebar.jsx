import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaListUl,
  FaSpinner,
  FaCheckCircle,
  FaFileAlt,
  FaCalendarDay,
  FaCalendarAlt,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-top">
          <NavLink to="/" className="logo-link">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              alt="Logo"
              className="sidebar-logo"
            />
            {!isCollapsed && <h1 className="sidebar-title">TaskProgresser</h1>}
          </NavLink>
        </div>
        <button className="collapse-btn" onClick={toggleCollapse}>
          <FaBars />
        </button>
      </div>

      {/* Navigation */}
      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaTachometerAlt className="nav-icon" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/total-tasks" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaListUl className="nav-icon" />
            {!isCollapsed && <span>Total Tasks</span>}
          </NavLink>

          <NavLink to="/todo-list" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaListUl className="nav-icon" />
            {!isCollapsed && <span>Todo List</span>}
          </NavLink>

          <NavLink to="/in-progress" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaSpinner className="nav-icon" />
            {!isCollapsed && <span>In Progress</span>}
          </NavLink>

          <NavLink to="/completed" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaCheckCircle className="nav-icon" />
            {!isCollapsed && <span>Completed</span>}
          </NavLink>

          <NavLink to="/drafts" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaFileAlt className="nav-icon" />
            {!isCollapsed && <span>Drafts</span>}
          </NavLink>

          <NavLink to="/today" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaCalendarDay className="nav-icon" />
            {!isCollapsed && <span>Today</span>}
          </NavLink>

          <NavLink to="/upcoming" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaCalendarAlt className="nav-icon" />
            {!isCollapsed && <span>Upcoming</span>}
          </NavLink>

          <NavLink to="/progress" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <FaChartLine className="nav-icon" />
            {!isCollapsed && <span>Progress</span>}
          </NavLink>
        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-profile">
        <div className="profile-info" onClick={() => navigate("/profile")} title="View Profile">
          <FaUserCircle className="profile-avatar" />
          {!isCollapsed && (
            <div className="profile-details">
              <span className="profile-name">{user?.name || "Guest"}</span>
              <span className="profile-email">{user?.email || "Not logged in"}</span>
            </div>
          )}
        </div>
        {user && !isCollapsed && (
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
