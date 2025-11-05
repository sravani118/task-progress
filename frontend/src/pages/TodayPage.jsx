import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../components/TaskCard";
import Layout from "../components/Layout";
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
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayTasks = res.data.filter((task) => {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
      
      setTasks(todayTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
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
      if (!a.priority || !b.priority) return 0;
      const order = { high: 1, medium: 2, low: 3 };
      return sortOrder === "asc" 
        ? order[a.priority] - order[b.priority]
        : order[b.priority] - order[a.priority];
    });

  return (
    <Layout>
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
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
            ))
          ) : (
            <p className="empty-text">No tasks scheduled for today.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TodayPage;

