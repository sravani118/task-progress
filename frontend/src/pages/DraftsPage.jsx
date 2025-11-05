import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import Layout from "../components/Layout";
import { useModal } from "../contexts/ModalContext";
import "./DraftsPage.css";

const DraftsPage = () => {
  const { openModal } = useModal();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`);
    setTasks(res.data.filter((t) => t.isDraft));
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchPriority =
        filterPriority === "all" || task.priority === filterPriority;
      return matchSearch && matchPriority;
    })
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <Layout>
      <div className="drafts-page">
        {/* Header Section */}
        <div className="drafts-header">
          <div className="left">
            <h2>Draft Tasks</h2>
            <p>Manage your saved task drafts</p>
          </div>
          <button className="add-task-btn" onClick={openModal}>+ Add Task</button>
        </div>

        {/* Filters & Sorting */}
        <div className="controls">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Sort by Due Date ↑</option>
            <option value="desc">Sort by Due Date ↓</option>
          </select>
        </div>

        {/* Task List */}
        <div className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))
          ) : (
            <p className="empty-text">No draft tasks available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DraftsPage;
