import { NavLink } from "react-router-dom";
import { FiGrid, FiBox, FiChevronLeft, FiChevronRight, FiDatabase } from "react-icons/fi";

function Sidebar({ collapsed, toggleCollapse, mobileOpen, closeMobile }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FiDatabase className="logo-icon" />
          <span className="logo-text">IMS Enterprise</span>
        </div>
        <button 
          className="collapse-btn-desktop" 
          onClick={toggleCollapse} 
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/inventory" 
              onClick={closeMobile} 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              end
            >
              <FiGrid className="nav-icon" />
              <span className="nav-text">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/inventory/products" 
              onClick={closeMobile} 
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              <FiBox className="nav-icon" />
              <span className="nav-text">Products</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span className="footer-dot"></span>
        <span className="footer-text">v1.0.0 Enterprise</span>
      </div>
    </aside>
  );
}

export default Sidebar;