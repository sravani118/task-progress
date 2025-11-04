import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddTaskModal from "./AddTaskModal";
import { useModal } from "../contexts/ModalContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isModalOpen, closeModal } = useModal();

  return (
    <div className={`app-layout ${isCollapsed ? "collapsed" : ""}`}>
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <main className="main-content">
        {children}
      </main>
      {isModalOpen && <AddTaskModal onClose={closeModal} />}
    </div>
  );
};

export default Layout;
