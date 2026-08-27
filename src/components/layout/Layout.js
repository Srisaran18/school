import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="app-layout d-flex">
      <Sidebar />
      <main className="main-content flex-grow-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
