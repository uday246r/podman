import { useEffect, useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeModal from "../components/EmployeeModal";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../services/employeeService";
import "../styles/dashboard.css";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
      loadEmployees();
    }
  };

  const handleSubmit = async (payload) => {
    if (selectedEmployee) {
      await updateEmployee(selectedEmployee.id, payload);
    } else {
      await createEmployee(payload);
    }
    setIsModalOpen(false);
    loadEmployees();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="dashboard-top">
          <div>
            <h1>Team Directory</h1>
            <p>Manage your team members, departments, and compensation</p>
          </div>
          <button className="create-btn" onClick={handleCreate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Member
          </button>
        </div>

        <div className="metrics-overview">
          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-data">
              <h3>Total Members</h3>
              <h2>{employees.length}</h2>
              <span className="trend positive">Active Team</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🏢</div>
            <div className="metric-data">
              <h3>Departments</h3>
              <h2>{new Set(employees.map(e => e.department)).size}</h2>
              <span className="trend neutral">Across Enterprise</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-data">
              <h3>Average Salary</h3>
              <h2>₹ {employees.length ? Math.round(employees.reduce((acc, curr) => acc + Number(curr.salary), 0) / employees.length).toLocaleString() : 0}</h2>
              <span className="trend neutral">Current Fiscal Year</span>
            </div>
          </div>
        </div>

        {employees && employees.length > 0 ? (
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h3>No employees found</h3>
            <p>Get started by adding a new team member to your directory.</p>
          </div>
        )}
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
}

export default Dashboard;