import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";
import { removeToken } from "../utils/auth";

const getUserIdFromToken = () => {
    // Dummy decoder for demo
    return 2;
};

function Sidebar() {
  const location = useLocation();
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const userId = getUserIdFromToken();
        const res = await fetch(`http://localhost:5005/api/access/userpermissions/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setPermissions(data);
        }
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
      }
    };
    fetchPermissions();
  }, []);

  const logout = () => {
    removeToken();
    window.location.href = "/";
  };

  const allNavItems = [
    { name: "Dashboard", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", moduleName: "Dashboard" },
    { name: "Employees", path: "/employees", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", moduleName: "EmployeeModule" },
    { name: "Inventory", path: "/inventory", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", moduleName: "InventoryModule" },
    { name: "Assets", path: "/assets", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", moduleName: "AssetsModule" },
    { name: "Helpdesk", path: "/helpdesk", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", moduleName: "HelpdeskModule" },
    { name: "Permissions", path: "/admin/permissions", icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.092 2.019-.273 3-.161.89-.38 1.76-.649 2.6m-3.12 1.9c-.846.126-1.716.19-2.6.19a14.004 14.004 0 01-5.89-1.3m16.89-1.3A13.916 13.916 0 0120 11", moduleName: "PermissionManagement" },
    { name: "Maintenance", path: "/admin/maintenance", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z", moduleName: "ModuleMaintenance" }
  ];

  // Filter items based on fetched permissions
  const navItems = allNavItems.filter(item => {
    // Everyone sees Dashboard for now unless you want it protected too
    if (item.name === "Dashboard") return true;
    
    // Check if the current user has the 'View' (or '*') permission mapped to this moduleName
    return permissions.some(p => 
      (p.moduleName.toLowerCase() === item.moduleName.toLowerCase() || p.moduleName === "*") &&
      (p.action.toLowerCase() === "view" || p.action === "*")
    );
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">E</div>
        <h2>Enterprise</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname.startsWith(item.path) ? "active" : ""}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon}></path>
            </svg>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;