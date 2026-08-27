import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { canWrite } from "../../utils/constants";
import { createHomework, deleteHomework, getHomeworks, updateHomework } from "../../api/services";

const emptyForm = {
  title: "",
  description: "",
  subject: "",
  class: "",
  section: "",
  dueDate: "",
};

const Homeworks = () => {
  const { user } = useAuth();
  const [homeworks, setHomeworks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchHomeworks = async () => {
    try {
      const data = await getHomeworks();
      setHomeworks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateHomework(editingId, form);
      } else {
        await createHomework(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchHomeworks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (hw) => {
    setEditingId(hw._id);
    setForm({
      title: hw.title,
      description: hw.description,
      subject: hw.subject,
      class: hw.class,
      section: hw.section || "",
      dueDate: hw.dueDate ? hw.dueDate.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this homework?")) return;
    try {
      await deleteHomework(id);
      fetchHomeworks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Homeworks</h2>
        {canWrite(user?.role) && (
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
            {showForm ? "Cancel" : "Add Homework"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && canWrite(user?.role) && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <input name="title" className="form-control" placeholder="Title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <input name="subject" className="form-control" placeholder="Subject" value={form.subject} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <textarea name="description" className="form-control" rows="3" placeholder="Description" value={form.description} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <input name="class" className="form-control" placeholder="Class" value={form.class} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <input name="section" className="form-control" placeholder="Section (optional)" value={form.section} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <input name="dueDate" type="date" className="form-control" value={form.dueDate} onChange={handleChange} required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">{editingId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row g-3">
        {homeworks.map((hw) => (
          <div key={hw._id} className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5>{hw.title}</h5>
                  {canWrite(user?.role) && (
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(hw)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(hw._id)}>Delete</button>
                    </div>
                  )}
                </div>
                <p className="text-muted mb-2">{hw.description}</p>
                <div className="small">
                  <span className="badge bg-light text-dark me-2">{hw.subject}</span>
                  <span className="badge bg-light text-dark me-2">Class {hw.class}</span>
                  <span className="text-muted">Due: {new Date(hw.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homeworks;
