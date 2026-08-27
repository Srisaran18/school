import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { canWrite } from "../../utils/constants";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../../api/services";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  class: "",
  section: "",
  rollNumber: "",
  parentPhone: "",
};

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
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
        await updateStudent(editingId, payload);
      } else {
        await createStudent(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({
      name: student.name,
      email: student.email,
      password: "",
      phone: student.phone || "",
      class: student.class || "",
      section: student.section || "",
      rollNumber: student.rollNumber || "",
      parentPhone: student.parentPhone || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Students</h2>
        {canWrite(user?.role) && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm(emptyForm);
            }}
          >
            {showForm ? "Cancel" : "Add Student"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && canWrite(user?.role) && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5>{editingId ? "Edit Student" : "Add Student"}</h5>
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
              <div className="col-md-3">
                <input name="class" className="form-control" placeholder="Class" value={form.class} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <input name="section" className="form-control" placeholder="Section" value={form.section} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input name="rollNumber" className="form-control" placeholder="Roll Number" value={form.rollNumber} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <input name="phone" className="form-control" placeholder="Phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <input name="parentPhone" className="form-control" placeholder="Parent Phone" value={form.parentPhone} onChange={handleChange} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">
                  {editingId ? "Update" : "Save"} Student
                </button>
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
                <th>Class</th>
                <th>Section</th>
                <th>Roll No</th>
                {canWrite(user?.role) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan="6">No students found.</td></tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.class}</td>
                    <td>{student.section || "-"}</td>
                    <td>{student.rollNumber}</td>
                    {canWrite(user?.role) && (
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(student)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(student._id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
