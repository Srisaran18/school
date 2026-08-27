import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../api/services";
import { canWrite } from "../utils/constants";

const Home = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboard = await getDashboard();
        setData(dashboard);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Welcome, {user?.name}</h2>
          <p className="text-muted mb-0">
            {user?.role === "student"
              ? `Class ${user?.class}${user?.section ? ` - ${user.section}` : ""} | Roll No: ${user?.rollNumber}`
              : "Manage school activities from your dashboard"}
          </p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {canWrite(user?.role) && (
          <div className="col-md-4">
            <div className="card stat-card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Total Students</h6>
                <h3>{data?.stats?.studentCount || 0}</h3>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-4">
          <div className="card stat-card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Homeworks</h6>
              <h3>{data?.stats?.homeworkCount || 0}</h3>
            </div>
          </div>
        </div>
        {user?.role === "student" && (
          <>
            <div className="col-md-4">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Attendance</h6>
                  <h3>
                    {data?.stats?.attendanceSummary?.present || 0}/
                    {data?.stats?.attendanceSummary?.total || 0}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="text-muted">Average Marks</h6>
                  <h3>{data?.stats?.marksSummary?.average || 0}%</h3>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Latest Circulars</h5>
              <Link to="/circulars" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {data?.circulars?.length > 0 ? (
                data.circulars.map((circular) => (
                  <div key={circular._id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">
                        {circular.isPinned && <span className="badge bg-warning text-dark me-2">Pinned</span>}
                        {circular.title}
                      </h6>
                      <small className="text-muted">
                        {new Date(circular.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <p className="text-muted mb-0">{circular.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0">No circulars yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Homework</h5>
              <Link to="/homeworks" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {data?.recentHomework?.length > 0 ? (
                data.recentHomework.map((hw) => (
                  <div key={hw._id} className="border-bottom pb-2 mb-2">
                    <strong>{hw.title}</strong>
                    <div className="small text-muted">
                      {hw.subject} | Due: {new Date(hw.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted mb-0">No homework assigned.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
