import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import "./ProgressPage.css";

const ProgressPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inprogress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      const all = res.data.filter((t) => !t.isDraft);
      setStats({
        total: all.length,
        todo: all.filter((t) => t.status === "todo").length,
        inprogress: all.filter((t) => t.status === "inprogress").length,
        completed: all.filter((t) => t.status === "completed").length,
      });
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };

  const percent =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <Layout>
      <div className="progress-page">
        {/* Header Section */}
        <div className="progress-header">
          <div className="left">
            <h2>Progress Overview</h2>
            <p>Track your productivity and task completion</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="progress-stats">
          <div className="stat-card total">
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card todo">
            <h3>To Do</h3>
            <p>{stats.todo}</p>
          </div>
          <div className="stat-card inprogress">
            <h3>In Progress</h3>
            <p>{stats.inprogress}</p>
          </div>
          <div className="stat-card completed">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-section">
          <div className="progress-bar-container">
            <div className="progress-labels">
              <h3>Overall Completion Rate</h3>
              <span className="percent">{percent}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Progress Analysis */}
        <div className="progress-analysis">
          <h3>Task Distribution</h3>
          <div className="distribution-bars">
            <div className="distribution-item">
              <span>To Do</span>
              <div className="distribution-bar">
                <div
                  className="distribution-fill todo"
                  style={{
                    width: `${stats.total ? (stats.todo / stats.total) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <span>{Math.round(stats.total ? (stats.todo / stats.total) * 100 : 0)}%</span>
            </div>
            <div className="distribution-item">
              <span>In Progress</span>
              <div className="distribution-bar">
                <div
                  className="distribution-fill inprogress"
                  style={{
                    width: `${stats.total ? (stats.inprogress / stats.total) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <span>{Math.round(stats.total ? (stats.inprogress / stats.total) * 100 : 0)}%</span>
            </div>
            <div className="distribution-item">
              <span>Completed</span>
              <div className="distribution-bar">
                <div
                  className="distribution-fill completed"
                  style={{
                    width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%`
                  }}
                ></div>
              </div>
              <span>{Math.round(stats.total ? (stats.completed / stats.total) * 100 : 0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProgressPage;
