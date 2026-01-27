import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import axios from "axios";

import { AdminPage } from "./Admin/AdminPage";
import { AdminDashboard } from "./Admin/AdminDashBoard";
import { NoticePage } from "./Admin/AdminNotice/NoticePage";
import { BudgetPage } from "./Admin/BudgetPage/BudgetPage";
import { LoanRequestPage } from "./Admin/LoanRequest/LoanRequestPage";
import { MembersPage } from "./Admin/Members/MembersPage";

import { MemberPage } from "./Member/MemberPage";
import Home from "./pages/Home";
import Loans from "./pages/Loans";
import Notices from "./pages/Notices";
import Contacts from "./pages/Contacts";

import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";

import CreateLoanRequest from "./pages/CreateLoanRequest";

function App() {
  const [user, setUser] = useState(null); // memory-only auth
  const [showRegister, setShowRegister] = useState(false);

  /* ---------- LOGIN ---------- */
  const handleLogin = async (loginData) => {
    try {
      const res = await axios.post("http://localhost:8080/login", {
        name: loginData.username,
        password: loginData.password,
      });

      localStorage.setItem("token", res.data.token);

      const userRes = await axios.get("http://localhost:8080/dashboard", {
        headers: { Authorization: `Bearer ${res.data.token}` },
      });

      setUser(userRes.data);
    } catch (err) {
      alert(err.response?.data || "Login failed");
      console.log(err);
    }
  };

  /* ---------- REGISTER ---------- */
  const handleRegister = async (registerData) => {
    try {
      await axios.post("http://localhost:8080/register", registerData);

      // auto-login after register
      const loginRes = await axios.post("http://localhost:8080/login", {
        name: registerData.name,
        password: registerData.password,
      });

      localStorage.setItem("token", loginRes.data.token);

      const userRes = await axios.get("http://localhost:8080/dashboard", {
        headers: { Authorization: `Bearer ${loginRes.data.token}` },
      });

      setUser(userRes.data);
    } catch (err) {
      alert(err.response?.data || "Registration failed");
      console.log(err);
    }
  };

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  /* ---------- AUTO LOGIN ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

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
  if (user.role === "ADMIN") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage onLogout={handleLogout} />}>
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
      <Route path="/member" element={<MemberPage onLogout={handleLogout} />}>
        <Route index element={<Home user={user} />} />
        <Route path="loans" element={<Loans user={user} />} />
        <Route path="notices" element={<Notices user={user} />} />
        <Route path="contacts" element={<Contacts user={user} />} />
        <Route path = "createrequest" element = {<CreateLoanRequest user={user} />}/>
      </Route>

      <Route path="*" element={<Navigate to="/member" replace />} />
    </Routes>
  );
}

export default App;
