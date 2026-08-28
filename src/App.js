import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Students from "./pages/students/Students";
import Homeworks from "./pages/homeworks/Homeworks";
import Attendance from "./pages/attendance/Attendance";
import Marks from "./pages/marks/Marks";
import Circulars from "./pages/circulars/Circulars";
import Staff from "./pages/staff/Staff";
import { ROLES } from "./utils/constants";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.STUDENT]} />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/homeworks" element={<Homeworks />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/circulars" element={<Circulars />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<Layout />}>
          <Route path="/staff" element={<Staff />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
