import React, { useState } from 'react';

const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '', role: 'member' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!loginForm.username || !loginForm.password) {
      setError('Please enter username and password');
      return;
    }

    if (loginForm.role === 'admin') {
      if (loginForm.username.toLowerCase() === 'admin' && loginForm.password === 'admin123') {
        onLogin({ id: 0, name: 'Admin', role: 'admin' });
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const member = registeredUsers.find(
        m => (m.name.toLowerCase().includes(loginForm.username.toLowerCase()) || 
              m.phone === loginForm.username) &&
             m.password === loginForm.password
      );

      if (member) {
        onLogin({ ...member, role: 'member' });
      } else {
        setError('Invalid credentials. Please check your username/phone and password.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 p-4">
      <div className="bg-white text-gray-500 max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10">
        
        {/* Header */}
        <h2 className="text-2xl font-bold mb-9 text-center text-gray-800">Sign In</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLoginForm({...loginForm, role: 'admin'})}
                className={`py-2.5 px-4 rounded font-medium transition-all ${
                  loginForm.role === 'admin'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-indigo-500/5 text-gray-600 border border-gray-500/10'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setLoginForm({...loginForm, role: 'member'})}
                className={`py-2.5 px-4 rounded font-medium transition-all ${
                  loginForm.role === 'member'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-indigo-500/5 text-gray-600 border border-gray-500/10'
                }`}
              >
                Member
              </button>
            </div>
          </div>

          {/* Username / Phone */}
          <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" stroke="#6B7280" strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              className="w-full outline-none bg-transparent py-2.5"
              type="text"
              placeholder={loginForm.role === 'admin' ? 'Admin Username' : 'Username / Phone'}
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center mt-2 mb-8 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.375 6.875V4.375a3.125 3.125 0 0 1 6.25 0v2.5m-7.5 0h8.75c.69 0 1.25.56 1.25 1.25v4.375c0 .69-.56 1.25-1.25 1.25h-8.75c-.69 0-1.25-.56-1.25-1.25V8.125c0-.69.56-1.25 1.25-1.25Z" stroke="#6B7280" strokeOpacity=".6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              className="w-full outline-none bg-transparent py-2.5"
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="my-4 p-3 bg-indigo-500/5 border border-gray-500/10 rounded text-xs space-y-1">
          <p className="font-semibold text-gray-700 mb-2">Demo Access:</p>
          <div className="text-gray-600">
            <span className="font-medium">Admin:</span> admin / admin123
          </div>
          <div className="text-gray-600">
            <span className="font-medium">Member:</span> Use registered credentials
          </div>
        </div>

        {/* Register Link */}
        {onSwitchToRegister && (
          <p className="text-center mt-4">
            New member?{' '}
            <button 
              onClick={onSwitchToRegister}
              className="text-blue-500 underline"
            >
              Register here
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;