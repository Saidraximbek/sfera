import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 main-layout">
      <main className="flex">
        
        <div className=" bg-gray-900 shadow-md min-h-screen rounded-sidebar">
          <Sidebar />
        </div>

     
        <div className="flex-1 p-6 py-10 main-main">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
