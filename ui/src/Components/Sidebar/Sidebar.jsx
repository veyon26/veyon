import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const menu = [
    { name: "Billing", path: "/", icon: "bi-receipt" },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-logo">Textile ERP</span>}
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
        </button>
      </div>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Menu */}
      <ul className="nav flex-column gap-1">
        {menu.map((item, index) => (
          <li className="nav-item" key={index}>
            <Link
              to={item.path}
              className={`nav-link sidebar-link ${
                location.pathname === item.path ? "active-link" : ""
              }`}
              title={collapsed ? item.name : ""}
            >
              <i className={`bi ${item.icon} sidebar-icon`}></i>
              {!collapsed && <span className="link-label">{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>

     
    </div>
  );
};

export default Sidebar;