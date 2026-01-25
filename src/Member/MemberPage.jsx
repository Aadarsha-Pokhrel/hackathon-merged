import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./MemberPage.css";

export function MemberPage({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    setMenuOpen(false);
    if (onLogout) onLogout();
  };

  return (
    <div className="member-layout">
      <div className="topbar">
        <h2 className="topbar-title">Member</h2>
        <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <h2 className="sidebar-title">Member</h2>
      <Link to="/member" onClick={() => setMenuOpen(false)}>Dashboard</Link>
      <Link to="/member/notices" onClick={() => setMenuOpen(false)}>Notices</Link>
      <Link to="/member/activeloans" onClick={() => setMenuOpen(false)}>My Loans</Link>
      <Link to="/member/contacts" onClick={() => setMenuOpen(false)}>Contact</Link>
      <Link to="/member/createrequest" onClick={() => setMenuOpen(false)}>Create Request</Link> {/* <-- add this */}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </aside>

      <main className="content" onClick={() => menuOpen && setMenuOpen(false)}>
        <Outlet />
      </main>
    </div>
  );
}
