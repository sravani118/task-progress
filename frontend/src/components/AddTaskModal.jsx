import React, { useState } from "react";
import axios from "axios";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import "./AddTaskModal.css";

const AddTaskModal = ({ onClose }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  // ✅ Handle Add Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        ...task,
        isDraft: false,
      });
      console.log("✅ Task added:", response.data);
      alert("Task added successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("❌ Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  // ✅ Handle Save Draft
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, {
        ...task,
        isDraft: true,
      });
      console.log("📝 Draft saved:", response.data);
      alert("Draft saved successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("❌ Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Task</h2>
        <form>
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={task.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={task.description}
            onChange={handleChange}
          />

          <div className="form-row">
            <label>Status:</label>
            <select name="status" value={task.status} onChange={handleChange}>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-row">
            <label>Priority:</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-row">
            <label>Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button className="save-btn" onClick={handleAddTask}>
              <FaPlus /> Add Task
            </button>
            <button className="draft-btn" onClick={handleSaveDraft}>
              <FaSave /> Save Draft
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
