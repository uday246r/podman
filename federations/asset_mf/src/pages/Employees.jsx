import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination.jsx";
import { ErrorMessage, LoadingMessage } from "../components/Message.jsx";
import { employeesService } from "../services/employeesService.js";

const emptyEmployee = { name: "", email: "", department: "" };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = (nextPage = page) => {
    setLoading(true);
    setError("");
    employeesService
      .getAll({ search, page: nextPage, pageSize: 10 })
      .then((data) => {
        setEmployees(data.items);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEmployees();
  }, [page]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.department) {
      setError("Please fill all employee fields.");
      return;
    }

    try {
      if (editingId) {
        await employeesService.update(editingId, form);
      } else {
        await employeesService.create(form);
      }
      setForm(emptyEmployee);
      setEditingId(null);
      loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({ name: employee.name, email: employee.email, department: employee.department });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this employee?")) {
      return;
    }

    try {
      await employeesService.remove(id);
      loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadEmployees(1);
  };

  return (
    <>
      <PageHeader title="Employees" subtitle="Maintain employee details for asset assignments." />
      <ErrorMessage message={error} />
      <section className="split-layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>
          <label>
            Name
            <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>
            Department
            <input name="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </label>
          <div className="form-actions">
            <button type="submit">{editingId ? "Update" : "Add"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyEmployee); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
        <section className="panel">
          <div className="panel-heading">
            <h2>Employee List</h2>
            <form className="search-form" onSubmit={handleSearch}>
              <input placeholder="Search employees" value={search} onChange={(e) => setSearch(e.target.value)} />
              <button type="submit">Search</button>
            </form>
          </div>
          {loading && <LoadingMessage />}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 && (
                  <tr><td colSpan="4" className="empty-cell">No employees found.</td></tr>
                )}
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td className="action-cell">
                      <button type="button" className="small secondary" onClick={() => handleEdit(employee)}>Edit</button>
                      <button type="button" className="small danger" onClick={() => handleDelete(employee.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </section>
      </section>
    </>
  );
}
