import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 main-layout overflow-hidden">
      <main className="flex h-screen overflow-hidden">
        {/* Sticky Sidebar */}
        <div className="h-full sticky top-0 bg-gray-900 shadow-md rounded-sidebar min-w-[250px]">
          <Sidebar />
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-6 py-10 main-main">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
