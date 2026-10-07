import { Link } from "react-router-dom";
import { FiMenu, FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

const Header = ({ onToggleSidebar, pageTitle }) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onToggleSidebar} aria-label="Toggle menu">
          <FiMenu />
        </button>
        <h1 className="header__title">{pageTitle}</h1>
      </div>

      <div className="header__right">
        <button className="header__icon-btn" aria-label="Notifications">
          <FiBell />
        </button>
        <Link to="/profile" className="header__user">
          <div className="header__avatar">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt={user.username} />
            ) : (
              <span>{user?.username?.[0]?.toUpperCase() || "U"}</span>
            )}
          </div>
          <span className="header__username">{user?.username}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
