import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { canWrite } from "../../utils/constants";
import {
  deleteAttendance,
  getAttendance,
  getStudents,
  markAttendance,
  updateAttendance,
} from "../../api/services";

const Attendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: "", date: "", status: "present", remarks: "" });
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [attendanceData, studentData] = await Promise.all([
        getAttendance(),
        user?.role !== "student" ? getStudents() : Promise.resolve([]),
      ]);
      setRecords(attendanceData);
      setStudents(studentData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await markAttendance(form);
      setForm({ studentId: "", date: "", status: "present", remarks: "" });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (record, status) => {
    try {
      await updateAttendance(record._id, { status });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try {
      await deleteAttendance(id);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Attendance</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {canWrite(user?.role) && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5>Mark Attendance</h5>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-4">
                <select className="form-select" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} - {s.class}{s.section ? `/${s.section}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Save</button>
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
                <th>Date</th>
                <th>Status</th>
                <th>Remarks</th>
                {canWrite(user?.role) && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="5">No attendance records.</td></tr>
              ) : (
                records.map((record) => (
                  <tr key={record._id}>
                    <td>{record.student?.name || "-"}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      {canWrite(user?.role) ? (
                        <select className="form-select form-select-sm" value={record.status} onChange={(e) => handleStatusChange(record, e.target.value)}>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      ) : (
                        <span className="badge bg-secondary text-capitalize">{record.status}</span>
                      )}
                    </td>
                    <td>{record.remarks || "-"}</td>
                    {canWrite(user?.role) && (
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(record._id)}>Delete</button>
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

export default Attendance;
