import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Notices", path: "/notices" },
    { name: "Loan", path: "/activeloans" },
    { name: "Contact", path: "/contacts" },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("w-64"); // default full width

  // Shrink sidebar on smaller desktop screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setSidebarWidth("w-40"); // shrunk width
      } else {
        setSidebarWidth("w-64"); // full width
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen bg-indigo-500 text-white shadow-lg z-50 transition-all duration-300 ${sidebarWidth}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-24 border-b border-indigo-400">
          <Link to="/">
            <div className="h-20 w-20 rounded-full bg-indigo-300 flex items-center justify-center font-bold text-indigo-700 text-2xl">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-indigo-400">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-indigo-300 flex items-center justify-center font-bold text-indigo-700">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-indigo-200 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col mt-6 gap-2 px-4 flex-1">
          {navLinks.map((link, i) => {
            const path = link.name === "Loan" ? "/activeloans" : link.path;
            return (
              <Link
                key={i}
                to={path}
                className="px-2 py-2 rounded hover:bg-indigo-400 transition-all duration-300"
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 bg-indigo-500 text-white fixed w-full z-50">
        <Link to="/">
          <div className="h-12 w-12 rounded-full bg-indigo-300 flex items-center justify-center font-bold text-indigo-700">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </Link>

        {/* User name on mobile */}
        <div className="text-sm font-semibold">
          {user?.name}
        </div>

        {/* Hamburger / Cross Icon */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            // Cross (X) Icon
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-gray-800 flex flex-col items-center justify-center gap-6 transition-transform duration-500 md:hidden z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>

        {/* User info in mobile menu */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <p className="font-semibold text-lg">{user?.name}</p>
          <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
        </div>

        {navLinks.map((link, i) => {
          const path = link.name === "Loan" ? "/activeloans" : link.path;
          return (
            <Link
              key={i}
              to={path}
              onClick={() => setIsMenuOpen(false)}
              className="text-xl font-medium"
            >
              {link.name}
            </Link>
          );
        })}

        {/* Logout button in mobile menu */}
        <button
          onClick={() => {
            setIsMenuOpen(false);
            onLogout();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Navbar;

