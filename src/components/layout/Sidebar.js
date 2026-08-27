import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canWrite, isAdmin } from "../../utils/constants";
import { FiHome, FiUsers, FiBook, FiCalendar, FiAward, FiBell, FiUserCheck, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/", icon: FiHome, label: "Home", roles: ["admin", "staff", "student"] },
    { to: "/students", icon: FiUsers, label: "Students", roles: ["admin", "staff", "student"] },
    { to: "/homeworks", icon: FiBook, label: "Homeworks", roles: ["admin", "staff", "student"] },
    { to: "/attendance", icon: FiCalendar, label: "Attendance", roles: ["admin", "staff", "student"] },
    { to: "/marks", icon: FiAward, label: "Marks", roles: ["admin", "staff", "student"] },
    { to: "/circulars", icon: FiBell, label: "Circulars", roles: ["admin", "staff", "student"] },
    { to: "/staff", icon: FiUserCheck, label: "Staff", roles: ["admin"] },
  ];

  return (
    <aside className="sidebar bg-dark text-white">
      <div className="sidebar-header p-3 border-bottom border-secondary">
        <h5 className="mb-0">School Portal</h5>
        <small className="text-secondary">{user?.name}</small>
        <div>
          <span className="badge bg-primary text-capitalize">{user?.role}</span>
        </div>
      </div>
      <nav className="nav flex-column p-2">
        {navItems
          .filter((item) => item.roles.includes(user?.role))
          .map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === "/"} className="nav-link sidebar-link">
              <Icon className="me-2" />
              {label}
            </NavLink>
          ))}
      </nav>
      <div className="sidebar-footer p-3 mt-auto">
        <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
          <FiLogOut className="me-1" /> Logout
        </button>
        {canWrite(user?.role) && (
          <small className="d-block mt-2 text-secondary">
            {isAdmin(user?.role) ? "Full access" : "Staff access (no staff management)"}
          </small>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
