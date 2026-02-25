import { NavLink } from "react-router-dom";
import { Home, Compass, PlusSquare, User, Bookmark, Search, Menu } from "lucide-react";
import "../style/sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top-section">
        <div className="logo">Instagram</div>
        
        <nav className="nav-links">
          <NavLink to="/feed">
            <Home size={24} /> <span>Home</span>
          </NavLink>
          <NavLink to="/explore">
            <Search size={24} /> <span>Search</span>
          </NavLink>
          <NavLink to="/explore">
            <Compass size={24} /> <span>Explore</span>
          </NavLink>
          <NavLink to="/Save">
            <Bookmark size={24} /> <span>Save</span>
          </NavLink>
          <NavLink to="/create">
            <PlusSquare size={24} /> <span>Create</span>
          </NavLink>
          <NavLink to="/profile">
            <User size={24} /> <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      <div className="bottom-section">
        <button className="more-btn">
          <Menu size={24} /> <span>More</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;