import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user && user.role) {
        setRole(user.role.toLowerCase());
      }
    };
    fetchUser();
  }, []);

  const getPageTitle = () => {
    if (location.pathname.startsWith("/employees"))
      return "Employee Management";

    if (location.pathname.startsWith("/inventory"))
      return "Inventory Management";

    if (location.pathname.startsWith("/assets"))
      return "Asset Management";

    if (location.pathname.startsWith("/helpdesk"))
      return "Helpdesk Management";

    if (location.pathname.includes("/permissions"))
      return "Permission Management";

    if (location.pathname.includes("/maintenance"))
      return "Module Maintenance";

    return "Dashboard";
  };

  const handlePermissionManagement = () => {
    navigate(`/${role}/permissions`);
  };

  const handleMaintenance = () => {
    navigate(`/${role}/maintenance`);
  };

  const handleLogout = () => {
    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate("/");
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <h2 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }} title="Go to Dashboard">
          {getPageTitle()}
        </h2>
      </div>

      <div className="navbar-right">
        <button
          className="nav-action-btn"
          onClick={handleMaintenance}
        >
          Maintenance
        </button>

        <button
          className="nav-action-btn"
          onClick={handlePermissionManagement}
        >
          Permissions
        </button>

      

     
        

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

        <div className="profile-menu">
          <div className="avatar">
            {role.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;