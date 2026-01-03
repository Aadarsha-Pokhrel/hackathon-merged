import React, { useState } from 'react';

const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'member' 
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!registerForm.name || !registerForm.phone || !registerForm.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Check if user already exists in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = registeredUsers.find(
      u => u.name.toLowerCase() === registerForm.name.toLowerCase() || 
           u.phone === registerForm.phone ||
           (u.email && u.email.toLowerCase() === registerForm.email.toLowerCase())
    );

    if (userExists) {
      setError('User with this name, phone, or email already exists');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(), // Simple ID generation
      name: registerForm.name,
      phone: registerForm.phone,
      email: registerForm.email || '',
      password: registerForm.password, // In production, hash this!
      role: registerForm.role,
      totalDeposits: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    // Save to localStorage
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Call onRegister callback
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700 mb-2">महिला बचत समूह</h1>
          <h2 className="text-xl text-gray-600">Women's Savings Group</h2>
          <p className="text-sm text-gray-500 mt-2">Register New Account</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input 
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your full name"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input 
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your phone number"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input 
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input 
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter password (min 6 characters)"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <input 
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Confirm password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        
        <div className="mt-6 text-center">
          {(() => {
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            if (registeredUsers.length > 0) {
              return (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    onClick={onSwitchToLogin}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Login here
                  </button>
                </p>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;

