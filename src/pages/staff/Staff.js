import { useEffect, useState } from "react";
import { createStaff, deleteStaff, getStaff, updateStaff } from "../../api/services";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  designation: "",
  role: "staff",
};

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchStaff = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        delete payload.role;
        await updateStaff(editingId, payload);
      } else {
        await createStaff(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (staff) => {
    setEditingId(staff._id);
    setForm({
      name: staff.name,
      email: staff.email,
      password: "",
      phone: staff.phone || "",
      department: staff.department || "",
      designation: staff.designation || "",
      role: staff.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await deleteStaff(id);
      fetchStaff();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Staff Management</h2>
          <p className="text-muted mb-0">Admin only — add and manage staff accounts</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
          {showForm ? "Cancel" : "Add Staff"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <input name="name" className="form-control" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <input name="email" type="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <input name="password" type="password" className="form-control" placeholder={editingId ? "New Password (optional)" : "Password"} value={form.password} onChange={handleChange} required={!editingId} />
              </div>
              <div className="col-md-6">
                <select name="role" className="form-select" value={form.role} onChange={handleChange} disabled={!!editingId}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="col-md-4">
                <input name="department" className="form-control" placeholder="Department" value={form.department} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input name="designation" className="form-control" placeholder="Designation" value={form.designation} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input name="phone" className="form-control" placeholder="Phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">{editingId ? "Update" : "Save"} Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff._id}>
                  <td>{staff.name}</td>
                  <td>{staff.email}</td>
                  <td><span className="badge bg-primary text-capitalize">{staff.role}</span></td>
                  <td>{staff.department || "-"}</td>
                  <td>{staff.designation || "-"}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(staff)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(staff._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Staff;
