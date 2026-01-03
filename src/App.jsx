import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";

import { AdminPage } from "./Admin/AdminPage";
import { AdminDashboard } from "./Admin/AdminDashBoard";
import { NoticePage } from "./Admin/AdminNotice/NoticePage";
import { BudgetPage } from "./Admin/BudgetPage/BudgetPage";
import { LoanRequestPage } from "./Admin/LoanRequest/LoanRequestPage";
import { MembersPage } from "./Admin/Members/MembersPage";

import { MemberPage } from "./Member/MemberPage";
import Home from "./pages/Home";
import ActiveLoans from "./pages/ActiveLoans";
import Notices from "./pages/Notices";
import Contacts from "./pages/Contacts";

import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";

function App() {
  const [user, setUser] = useState(null); // memory-only auth
  const [showRegister, setShowRegister] = useState(false);

  /* ---------- AUTH HANDLERS ---------- */

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  /* ---------- NOT LOGGED IN ---------- */

  if (!user) {
    return showRegister ? (
      <RegisterScreen
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <LoginScreen
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  /* ---------- ADMIN ROUTES ---------- */

  if (user.role === "admin") {
    return (
      <Routes>
        <Route
          path="/admin"
          element={<AdminPage onLogout={handleLogout} />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="notice" element={<NoticePage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="loanRequest" element={<LoanRequestPage />} />
          <Route path="membersdetails" element={<MembersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  /* ---------- MEMBER ROUTES ---------- */

  return (
    <Routes>
      <Route
        path="/member"
        element={<MemberPage onLogout={handleLogout} />}
      >
        <Route index element={<Home user={user} />} />
        <Route path="activeloans" element={<ActiveLoans user={user} />} />
        <Route path="notices" element={<Notices user={user} />} />
        <Route path="contacts" element={<Contacts user={user} />} />
      </Route>

      <Route path="*" element={<Navigate to="/member" replace />} />
    </Routes>
  );
}

export default App;
