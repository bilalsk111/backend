import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  PlusSquare,
  User,
  Bookmark,
  Search,
  Menu,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../auth/auth.context";
import "../style/sidebar.scss";
import { useAuth } from "../../auth/hooks/useAuth";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";

const Sidebar = () => {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { handleLogout } = useAuth();
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

          <NavLink to="/reels">
            <Compass size={24} /> <span>Reels</span>
          </NavLink>

          <NavLink to="/save">
            <Bookmark size={24} /> <span>Save</span>
          </NavLink>

          <NavLink to="/create">
            <PlusSquare size={24} /> <span>Create</span>
          </NavLink>

          {user && (
            <NavLink to={`/profile/${user.username}`}>
              <User size={24} /> <span>Profile</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="bottom-section">
        <button onClick={() => setLogoutOpen(true)} className="more-btn">
          <LogOut size={24} /> <span>logout</span>
        </button>
      </div>
      <ConfirmModal
        isOpen={logoutOpen}
        title="Logout?"
        message="You will need to login again to access your account."
        confirmText="Logout"
        danger={true}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Sidebar;
