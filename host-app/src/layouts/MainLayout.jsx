import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="layout-container">

      {/* <Sidebar /> */}

      <div className="main-content">
        <Navbar />
        {children}
      </div>

    </div>
  );
}

export default MainLayout;