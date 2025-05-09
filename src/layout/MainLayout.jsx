import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      <header>
        <h1>My App</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
