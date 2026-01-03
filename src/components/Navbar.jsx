import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { LogOut } from "lucide-react";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Notices", path: "/notices" },
    { name: "Loan", path: "/activeloans" },
    { name: "Contact", path: "/contacts" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 1280);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/">
            <div className="avatar large">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="avatar small">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <p className="username">{user?.name}</p>
          <p className="role">{user?.role}</p>
        </div>

        {/* Links */}
        <div className="sidebar-links">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className="sidebar-link">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="sidebar-logout">
          <button onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="mobile-navbar">
        <Link to="/">
          <div className="avatar medium">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </Link>

        <span className="mobile-username">{user?.name}</span>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-btn">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
          ✕
        </button>

        <div className="mobile-user">
          <div className="avatar large white">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <p>{user?.name}</p>
          <span>{user?.role}</span>
        </div>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="mobile-link"
          >
            {link.name}
          </Link>
        ))}

        <button
          className="mobile-logout"
          onClick={() => {
            setIsMenuOpen(false);
            onLogout();
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </>
  );
};

export default Navbar;
