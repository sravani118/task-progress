import React, { useEffect, useState } from "react";
import api from "../config/api";
import TaskCard from "../components/TaskCard";
import { useModal } from "../contexts/ModalContext";
import "./TodayPage.css";

const TodayPage = () => {
  const { openModal } = useModal();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchTasks();
  }, [search, filterPriority, sortOrder]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams({
        dateFilter: 'today',
        sortBy: 'priority',
        sortOrder: sortOrder
      });
      
      if (search) params.append('search', search);
      if (filterPriority !== 'all') params.append('priority', filterPriority);
      
      const res = await api.get(`/api/tasks?${params.toString()}`);
      const data = res.data.tasks || res.data;
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div className="today-page">
        {/* Header Section */}
        <div className="today-header">
          <div className="left">
            <h2>Today's Tasks</h2>
            <p>Focus on your tasks for today</p>
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
            <option value="asc">Sort by Priority ↑</option>
            <option value="desc">Sort by Priority ↓</option>
          </select>
        </div>

        {/* Task List */}
        <div className="task-list">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))
          ) : (
            <p className="empty-text">No tasks scheduled for today.</p>
          )}
        </div>
      </div>
  );
};

export default TodayPage;

