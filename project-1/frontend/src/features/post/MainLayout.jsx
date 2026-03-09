import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const MainLayout = () => {
  return (
    <div className="main-layout-container" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar /> 
      
      <main className="main-content" style={{ flex: 1, position: 'relative' }}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default MainLayout;