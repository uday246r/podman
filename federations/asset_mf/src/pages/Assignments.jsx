import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { ErrorMessage, LoadingMessage } from "../components/Message.jsx";
import { assignmentsService } from "../services/assignmentsService.js";
import { assetsService } from "../services/assetsService.js";
import { employeesService } from "../services/employeesService.js";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    assetId: "",
    employeeId: "",
    assignedDate: new Date().toISOString().slice(0, 10)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableAssets = useMemo(
    () => assets.filter((asset) => asset.status === "Available"),
    [assets]
  );

  const loadPageData = () => {
    setLoading(true);
    setError("");
    Promise.all([
      assignmentsService.getAll(),
      assetsService.getAll({ page: 1, pageSize: 50 }),
      employeesService.getAll({ page: 1, pageSize: 50 })
    ])
      .then(([assignmentData, assetData, employeeData]) => {
        setAssignments(assignmentData);
        setAssets(assetData.items);
        setEmployees(employeeData.items);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.assetId || !form.employeeId || !form.assignedDate) {
      setError("Please select asset, employee, and assigned date.");
      return;
    }

    try {
      await assignmentsService.assign({
        assetId: Number(form.assetId),
        employeeId: Number(form.employeeId),
        assignedDate: form.assignedDate
      });
      setForm({ ...form, assetId: "", employeeId: "" });
      loadPageData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReturn = async (id) => {
    try {
      await assignmentsService.returnAsset(id);
      loadPageData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="Assignments" subtitle="Assign available assets and return them when no longer needed." />
      <ErrorMessage message={error} />
      <section className="split-layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>Assign Asset</h2>
          <label>
            Asset
            <select value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })}>
              <option value="">Select available asset</option>
              {availableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.assetName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Employee
            <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Assigned Date
            <input
              type="date"
              value={form.assignedDate}
              onChange={(e) => setForm({ ...form, assignedDate: e.target.value })}
            />
          </label>
          <button type="submit">Assign</button>
        </form>
        <section className="panel">
          <div className="panel-heading">
            <h2>Assigned Assets</h2>
          </div>
          {loading && <LoadingMessage />}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Employee</th>
                  <th>Assigned Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length === 0 && (
                  <tr><td colSpan="5" className="empty-cell">No assignments found.</td></tr>
                )}
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.assetName}</td>
                    <td>{assignment.employeeName}</td>
                    <td>{assignment.assignedDate}</td>
                    <td>
                      <StatusBadge status={assignment.returnedDate ? "Available" : "Assigned"} />
                    </td>
                    <td>
                      {!assignment.returnedDate ? (
                        <button type="button" className="small secondary" onClick={() => handleReturn(assignment.id)}>
                          Return
                        </button>
                      ) : (
                        <span className="muted">Returned {assignment.returnedDate}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </>
  );
}
