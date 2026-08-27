import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { canWrite } from "../../utils/constants";
import { createCircular, deleteCircular, getCirculars, updateCircular } from "../../api/services";

const emptyForm = {
  title: "",
  content: "",
  targetAudience: "all",
  class: "",
  section: "",
  isPinned: false,
};

const Circulars = () => {
  const { user } = useAuth();
  const [circulars, setCirculars] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchCirculars = async () => {
    try {
      const data = await getCirculars();
      setCirculars(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCirculars();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateCircular(editingId, form);
      } else {
        await createCircular(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchCirculars();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (circular) => {
    setEditingId(circular._id);
    setForm({
      title: circular.title,
      content: circular.content,
      targetAudience: circular.targetAudience,
      class: circular.class || "",
      section: circular.section || "",
      isPinned: circular.isPinned || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this circular?")) return;
    try {
      await deleteCircular(id);
      fetchCirculars();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Circulars</h2>
        {canWrite(user?.role) && (
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
            {showForm ? "Cancel" : "Add Circular"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && canWrite(user?.role) && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-8">
                <input name="title" className="form-control" placeholder="Title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <select name="targetAudience" className="form-select" value={form.targetAudience} onChange={handleChange}>
                  <option value="all">All Students</option>
                  <option value="class">Specific Class</option>
                </select>
              </div>
              {form.targetAudience === "class" && (
                <>
                  <div className="col-md-3">
                    <input name="class" className="form-control" placeholder="Class" value={form.class} onChange={handleChange} />
                  </div>
                  <div className="col-md-3">
                    <input name="section" className="form-control" placeholder="Section" value={form.section} onChange={handleChange} />
                  </div>
                </>
              )}
              <div className="col-12">
                <textarea name="content" className="form-control" rows="4" placeholder="Circular content" value={form.content} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input name="isPinned" type="checkbox" className="form-check-input" checked={form.isPinned} onChange={handleChange} id="isPinned" />
                  <label className="form-check-label" htmlFor="isPinned">Pin to top</label>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">{editingId ? "Update" : "Publish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3">
        {circulars.map((circular) => (
          <div key={circular._id} className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5>
                      {circular.isPinned && <span className="badge bg-warning text-dark me-2">Pinned</span>}
                      {circular.title}
                    </h5>
                    <p className="mb-2">{circular.content}</p>
                    <small className="text-muted">
                      {new Date(circular.createdAt).toLocaleString()} | By {circular.createdBy?.name || "Staff"}
                      {circular.targetAudience === "class" && ` | Class ${circular.class}`}
                    </small>
                  </div>
                  {canWrite(user?.role) && (
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(circular)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(circular._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Circulars;
