import React, { useState, useRef, useEffect } from "react";
import api from "../config/api";
import "./TaskCard.css";
import { FaTrash, FaCheck, FaRedoAlt, FaClipboardList, FaEllipsisV } from "react-icons/fa";

const TaskCard = ({ task, onUpdate }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await api.delete(`/api/tasks/${task._id}`);
      onUpdate(); // Refresh tasks
    }
  };

  const handleMove = async (newStatus) => {
    await api.put(`/api/tasks/${task._id}`, {
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

      <div className="task-actions" ref={menuRef}>
        <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
          <FaEllipsisV className="icon" />
        </button>
        
        {showMenu && (
          <div className="task-menu">
            {task.status !== "todo" && (
              <button onClick={() => {
                handleMove("todo");
                setShowMenu(false);
              }}>
                <FaClipboardList className="icon" /> To Do
              </button>
            )}

            {task.status !== "inprogress" && (
              <button onClick={() => {
                handleMove("inprogress");
                setShowMenu(false);
              }}>
                <FaRedoAlt className="icon" /> In Progress
              </button>
            )}

            {task.status !== "completed" && (
              <button onClick={() => {
                handleMove("completed");
                setShowMenu(false);
              }}>
                <FaCheck className="icon" /> Complete
              </button>
            )}

            <button onClick={() => {
              handleDelete();
              setShowMenu(false);
            }}>
              <FaTrash className="icon" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
