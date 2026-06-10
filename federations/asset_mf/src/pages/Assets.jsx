import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { ErrorMessage, LoadingMessage } from "../components/Message.jsx";
import { assetsService } from "../services/assetsService.js";

const emptyAsset = {
  assetName: "",
  category: "",
  brand: "",
  purchaseDate: "",
  status: "Available"
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState(emptyAsset);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAssets = (nextPage = page) => {
    setLoading(true);
    setError("");
    assetsService
      .getAll({ search, page: nextPage, pageSize: 10 })
      .then((data) => {
        setAssets(data.items);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAssets();
  }, [page]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.assetName || !form.category || !form.brand || !form.purchaseDate) {
      setError("Please fill all asset fields.");
      return;
    }

    setError("");
    try {
      if (editingId) {
        await assetsService.update(editingId, form);
      } else {
        await assetsService.create(form);
      }
      setForm(emptyAsset);
      setEditingId(null);
      loadAssets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset.id);
    setForm({
      assetName: asset.assetName,
      category: asset.category,
      brand: asset.brand,
      purchaseDate: asset.purchaseDate,
      status: asset.status
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this asset?")) {
      return;
    }

    try {
      await assetsService.remove(id);
      loadAssets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    loadAssets(1);
  };

  return (
    <>
      <PageHeader title="Assets" subtitle="Add, edit, search, and track college assets." />
      <ErrorMessage message={error} />
      <section className="split-layout">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Asset" : "Add Asset"}</h2>
          <label>
            Asset Name
            <input name="assetName" value={form.assetName} onChange={handleChange} />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} />
          </label>
          <label>
            Brand
            <input name="brand" value={form.brand} onChange={handleChange} />
          </label>
          <label>
            Purchase Date
            <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
            </select>
          </label>
          <div className="form-actions">
            <button type="submit">{editingId ? "Update" : "Add"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyAsset); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
        <section className="panel">
          <div className="panel-heading">
            <h2>Asset List</h2>
            <form className="search-form" onSubmit={handleSearch}>
              <input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
              <button type="submit">Search</button>
            </form>
          </div>
          {loading && <LoadingMessage />}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Purchase Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 && (
                  <tr><td colSpan="6" className="empty-cell">No assets found.</td></tr>
                )}
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.assetName}</td>
                    <td>{asset.category}</td>
                    <td>{asset.brand}</td>
                    <td>{asset.purchaseDate}</td>
                    <td><StatusBadge status={asset.status} /></td>
                    <td className="action-cell">
                      <button type="button" className="small secondary" onClick={() => handleEdit(asset)}>Edit</button>
                      <button type="button" className="small danger" onClick={() => handleDelete(asset.id)}>Delete</button>
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
