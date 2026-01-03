import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AdminPage } from './Admin/AdminPage';
import { AdminDashboard } from './Admin/AdminDashBoard';
import { NoticePage } from './Admin/AdminNotice/NoticePage';
import { BudgetPage } from './Admin/BudgetPage/BudgetPage';
import { LoanRequestPage } from './Admin/LoanRequest/LoanRequestPage';
import { MembersPage } from './Admin/Members/MembersPage';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ActiveLoans from './pages/ActiveLoans';
import Notices from './pages/Notices';
import Contacts from './pages/Contacts';

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
    
    // Check if there are any registered users to determine if we should show register or login
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    // If no users are registered yet, show register page by default
    // Otherwise, show login page
    setShowRegister(registeredUsers.length === 0);
    
    setIsCheckingAuth(false);
  }, []);

  // Save user to localStorage when logged in
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If not logged in, check if user should see register or login screen
  if (!user) {
    // Check if there are registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const shouldShowRegister = registeredUsers.length === 0 || showRegister;
    
    if (shouldShowRegister) {
      return (
        <RegisterScreen 
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            // Only allow switching to login if there are registered users
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            if (users.length > 0) {
              setShowRegister(false);
            }
          }}
        />
      );
    }
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // If logged in as admin, show admin routes
  if (user.role === 'admin') {
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

  // If logged in as member, show member routes
  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/activeloans" element={<ActiveLoans user={user} />} />
        <Route path="/notices" element={<Notices user={user} />} />
        <Route path="/contacts" element={<Contacts user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
