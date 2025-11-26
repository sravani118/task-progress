import React, { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import { useModal } from "../contexts/ModalContext";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      const tasks = res.data.tasks || res.data; // Support both formats
      setStats({
        total: tasks.length,
        todo: tasks.filter((t) => t.status === "todo").length,
        inProgress: tasks.filter((t) => t.status === "inprogress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  const handleTaskAdded = () => {
    // Refresh stats when a new task is added
    fetchTasks();
  };

  return (
    <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="add-btn" onClick={openModal}>
            + Add Task
          </button>
        </div>

        <div className="stats-container">
          <div className="stat-card total" onClick={() => handleCardClick("/total-tasks")}>
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card todo" onClick={() => handleCardClick("/todo-list")}>
            <h3>To-Do List</h3>
            <p>{stats.todo}</p>
          </div>
          <div className="stat-card inprogress" onClick={() => handleCardClick("/in-progress")}>
            <h3>In Progress</h3>
            <p>{stats.inProgress}</p>
          </div>
          <div className="stat-card completed" onClick={() => handleCardClick("/completed")}>
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
