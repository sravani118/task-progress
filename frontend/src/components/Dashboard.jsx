import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
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
      const res = await axios.get("http://localhost:5000/api/tasks");
      const tasks = res.data;
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

  return (
    <Layout>
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
    </Layout>
  );
};

export default Dashboard;
