import React from "react";
import axios from "axios";
import "./TaskCard.css";
import { FaTrash, FaCheck, FaRedoAlt, FaClipboardList } from "react-icons/fa";

const TaskCard = ({ task, onUpdate }) => {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`);
      onUpdate(); // Refresh tasks
    }
  };

  const handleMove = async (newStatus) => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
      ...task,
      status: newStatus,
    });
    onUpdate();
  };

  return (
    <div className="task-card">
      <div
        className="color-dot"
        style={{
          backgroundColor:
            task.priority === "high"
              ? "#ef4444"
              : task.priority === "medium"
              ? "#facc15"
              : "#22c55e",
        }}
      ></div>

      <div className="task-info">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <small>
          Priority: <strong>{task.priority.toUpperCase()}</strong> | Due:{" "}
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
        </small>
      </div>

      <div className="task-actions">
        {task.status !== "todo" && (
          <button className="todo-btn" onClick={() => handleMove("todo")}>
            <FaClipboardList className="icon" /> To Do
          </button>
        )}

        {task.status !== "inprogress" && (
          <button
            className="inprogress-btn"
            onClick={() => handleMove("inprogress")}
          >
            <FaRedoAlt className="icon" /> In Progress
          </button>
        )}

        {task.status !== "completed" && (
          <button
            className="complete-btn"
            onClick={() => handleMove("completed")}
          >
            <FaCheck className="icon" /> Complete
          </button>
        )}

        <button className="delete-btn" onClick={handleDelete}>
          <FaTrash className="icon" /> Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
