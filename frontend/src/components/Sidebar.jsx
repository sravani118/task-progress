import React, { useEffect, useRef } from "react";
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

const Sidebar = ({ isCollapsed = false, toggleCollapse }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const avatarRef = useRef(null);
  const logoutBtnRef = useRef(null);

  useEffect(() => {
    if (avatarRef.current) {
      const avatarStyles = window.getComputedStyle(avatarRef.current);
      console.log('🎨 Profile Avatar Styles:', {
        fontSize: avatarStyles.fontSize,
        width: avatarStyles.width,
        height: avatarStyles.height,
        color: avatarStyles.color
      });
    }

    if (logoutBtnRef.current) {
      const btnStyles = window.getComputedStyle(logoutBtnRef.current);
      console.log('🎨 Logout Button Styles:', {
        fontSize: btnStyles.fontSize,
        padding: btnStyles.padding,
        width: btnStyles.width,
        height: btnStyles.height,
        borderRadius: btnStyles.borderRadius
      });
    }
  }, [isCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleToggleClick = () => {
    if (toggleCollapse) {
      toggleCollapse();
    }
  };

  // Don't render if state is not properly initialized
  if (isCollapsed === undefined) {
    return null;
  }

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        <button className="collapse-btn" onClick={handleToggleClick}>
          <FaBars />
        </button>
        <NavLink to="/" className="logo-link">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
            alt="Logo"
            className="sidebar-logo"
          />
          {!isCollapsed && <h1 className="sidebar-title">TaskProgresser</h1>}
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Dashboard">
            <FaTachometerAlt className="nav-icon" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/total-tasks" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Total Tasks">
            <FaListUl className="nav-icon" />
            {!isCollapsed && <span>Total Tasks</span>}
          </NavLink>

          <NavLink to="/todo-list" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Todo List">
            <FaListUl className="nav-icon" />
            {!isCollapsed && <span>Todo List</span>}
          </NavLink>

          <NavLink to="/in-progress" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="In Progress">
            <FaSpinner className="nav-icon" />
            {!isCollapsed && <span>In Progress</span>}
          </NavLink>

          <NavLink to="/completed" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Completed">
            <FaCheckCircle className="nav-icon" />
            {!isCollapsed && <span>Completed</span>}
          </NavLink>

          <NavLink to="/drafts" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Drafts">
            <FaFileAlt className="nav-icon" />
            {!isCollapsed && <span>Drafts</span>}
          </NavLink>

          <NavLink to="/today" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Today">
            <FaCalendarDay className="nav-icon" />
            {!isCollapsed && <span>Today</span>}
          </NavLink>

          <NavLink to="/upcoming" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Upcoming">
            <FaCalendarAlt className="nav-icon" />
            {!isCollapsed && <span>Upcoming</span>}
          </NavLink>

          <NavLink to="/progress" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")} title="Progress">
            <FaChartLine className="nav-icon" />
            {!isCollapsed && <span>Progress</span>}
          </NavLink>
        </nav>
      </div>

      {/* Footer */}
      <div className="sidebar-profile">
        <div className="profile-info" onClick={() => navigate("/profile")} title="View Profile">
          <FaUserCircle className="profile-avatar" ref={avatarRef} />
          {!isCollapsed && (
            <div className="profile-details">
              <span className="profile-name">{user?.name || "Guest"}</span>
              <span className="profile-email">{user?.email || "Not logged in"}</span>
            </div>
          )}
        </div>
        {user && (
          <button className="logout-btn" ref={logoutBtnRef} onClick={handleLogout} title="Logout">
            <FaSignOutAlt className="logout-icon" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
