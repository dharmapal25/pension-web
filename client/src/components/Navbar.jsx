import { useEffect, useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAuthUser from "../hooks/useAuthRole";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: profile, fetchUser } = useAuthUser();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) fetchUser();
  }, [user]);

  const closeMenu = () => setMenuOpen(false);
  const profileView = () => {
    if (profile?.role && profile?.id) navigate(`/${profile.role}/profile/${profile.id}`);
    closeMenu();
  };

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <Link className="logo" to="/home" onClick={closeMenu}>
          <span className="logo-mark">C</span>CourseBox
        </Link>
        
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)

          }>
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <NavLink to="/home" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/courses" onClick={closeMenu}>Explore courses</NavLink>
          <NavLink to="/offers" onClick={closeMenu}>Offers</NavLink>

          {!user ? (
            <button
              className="nav-cta"
              type="button"
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}>
              Log in
            </button>
          ) : (

            <button
              className="nav-cta"
              type="button"
              onClick={profileView}
              disabled={!profile}>
              My profile
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
