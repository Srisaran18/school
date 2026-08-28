import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { canWrite } from "../../utils/constants";
import { createMark, deleteMark, getMarks, getStudents, updateMark } from "../../api/services";

const emptyForm = {
  studentId: "",
  subject: "",
  examType: "",
  marksObtained: "",
  maxMarks: "100",
  remarks: "",
};

const Marks = () => {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [marksData, studentData] = await Promise.all([
        getMarks(),
        user?.role !== "student" ? getStudents() : Promise.resolve([]),
      ]);
      setMarks(marksData);
      setStudents(studentData);
    } catch (err) {
      setError(err.message);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      marksObtained: Number(form.marksObtained),
      maxMarks: Number(form.maxMarks),
    };

    try {
      if (editingId) {
        await updateMark(editingId, payload);
      } else {
        await createMark(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (mark) => {
    setEditingId(mark._id);
    setForm({
      studentId: mark.student?._id || mark.student,
      subject: mark.subject,
      examType: mark.examType,
      marksObtained: mark.marksObtained,
      maxMarks: mark.maxMarks,
      remarks: mark.remarks || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mark record?")) return;
    try {
      await deleteMark(id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Marks</h2>
        {canWrite(user?.role) && (
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
            {showForm ? "Cancel" : "Add Marks"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && canWrite(user?.role) && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <select name="studentId" className="form-select" value={form.studentId} onChange={handleChange} required>
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <input name="subject" className="form-control" placeholder="Subject" value={form.subject} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <input name="examType" className="form-control" placeholder="Exam Type" value={form.examType} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <input name="marksObtained" type="number" className="form-control" placeholder="Marks Obtained" value={form.marksObtained} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <input name="maxMarks" type="number" className="form-control" placeholder="Max Marks" value={form.maxMarks} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <input name="remarks" className="form-control" placeholder="Remarks" value={form.remarks} onChange={handleChange} />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-success">{editingId ? "Update" : "Save"}</button>
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
                <th>Student</th>
                <th>Subject</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Percentage</th>
                {canWrite(user?.role) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {marks.length === 0 ? (
                <tr><td colSpan="6">No marks recorded.</td></tr>
              ) : (
                marks.map((mark) => (
                  <tr key={mark._id}>
                    <td>{mark.student?.name || "-"}</td>
                    <td>{mark.subject}</td>
                    <td>{mark.examType}</td>
                    <td>{mark.marksObtained}/{mark.maxMarks}</td>
                    <td>{((mark.marksObtained / mark.maxMarks) * 100).toFixed(1)}%</td>
                    {canWrite(user?.role) && (
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(mark)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(mark._id)}>Delete</button>
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

export default Marks;
