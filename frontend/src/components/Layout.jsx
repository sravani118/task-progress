import React, { useState, useMemo, useCallback } from "react";
import Sidebar from "./Sidebar";
import AddTaskModal from "./AddTaskModal";
import { useModal } from "../contexts/ModalContext";
import "./Layout.css";

const Layout = ({ children, onTaskAdded }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isModalOpen, closeModal } = useModal();

  const handleToggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const layoutClassName = useMemo(() => 
    `app-layout ${isCollapsed ? "collapsed" : ""}`,
    [isCollapsed]
  );

  return (
    <div className={layoutClassName}>
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={handleToggle} />
      <main className="main-content">
        {children}
      </main>
      {isModalOpen && (
        <AddTaskModal 
          onClose={closeModal} 
          onTaskAdded={onTaskAdded}
        />
      )}
    </div>
  );
};

export default Layout;
