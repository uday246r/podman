import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { ErrorMessage, LoadingMessage } from "../components/Message.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { dashboardService } from "../services/dashboardService.js";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    dashboardService
      .get()
      .then(setDashboard)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Quick overview of asset availability and recent assignments." />
      {loading && <LoadingMessage />}
      <ErrorMessage message={error} />
      {dashboard && (
        <>
          <section className="stats-grid">
            <div className="stat-card">
              <span>Total Assets</span>
              <strong>{dashboard.totalAssets}</strong>
            </div>
            <div className="stat-card">
              <span>Available Assets</span>
              <strong>{dashboard.availableAssets}</strong>
            </div>
            <div className="stat-card">
              <span>Assigned Assets</span>
              <strong>{dashboard.assignedAssets}</strong>
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <h2>Recent Asset Assignments</h2>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Employee</th>
                    <th>Assigned Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentAssignments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-cell">No recent assignments found.</td>
                    </tr>
                  )}
                  {dashboard.recentAssignments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.assetName}</td>
                      <td>{item.employeeName}</td>
                      <td>{item.assignedDate}</td>
                      <td><StatusBadge status={item.returnedDate ? "Available" : "Assigned"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
