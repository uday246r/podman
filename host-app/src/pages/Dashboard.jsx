import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const apps = [
    { title: "Employee Management", description: "Manage team directory, salaries, and details.", path: "/employees", active: true, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { title: "Inventory Management", description: "Track stock, orders, and warehouses.", path: "/inventory", active: true, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { title: "Asset Management", description: "Monitor hardware, software, and tools.", path: "/assets", active: true, icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { title: "Helpdesk Management", description: "Support tickets, SLAs, and customer care.", path: "/helpdesk", active: true, icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
  ];

  return (
    <div className="dashboard-container">
      {/* <header className="dashboard-hero">
        <div className="hero-content">
          <h1>Welcome back, Admin 👋</h1>
          <p>Here is an overview of your enterprise systems today.</p>
        </div>
        <div className="hero-date">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </header> */}
{/* 
      <div className="metrics-overview">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-data">
            <h3>Total Employees</h3>
            <h2>1,248</h2>
            <span className="trend positive">+12 this month</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-data">
            <h3>Active Inventory</h3>
            <h2>8,542</h2>
            <span className="trend positive">+5.2% vs last week</span>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">💻</div>
          <div className="metric-data">
            <h3>Assigned Assets</h3>
            <h2>4,105</h2>
            <span className="trend neutral">Stable</span>
          </div>
        </div>
      </div> */}

      <div className="modules-section">
        <div className="section-title">
          <h2>Enterprise Modules</h2>
          <p>Access your integrated applications below</p>
        </div>
        
        <div className="dashboard-grid">
          {apps.map((app, index) => (
            <div 
              key={index} 
              className={`dashboard-card ${app.active ? 'active-card' : 'inactive-card'}`}
              onClick={() => app.active && navigate(app.path)}
            >
              <div className="card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={app.icon}></path>
                </svg>
              </div>
              <div className="card-content">
                <h2>{app.title}</h2>
                <p>{app.description}</p>
              </div>
              {!app.active && <span className="coming-soon">Coming Soon</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;