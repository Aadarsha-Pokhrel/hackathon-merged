import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { User, Lock, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import logo from "../assets/logo.png"
const LoginScreen = ({ onLogin, onSwitchToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      await onLogin(form);
    } catch (err) {
       // handled in parent, but safe
    } finally {
      setLoading(false);
    }
  };

  return (
<div
  className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
  style={{ backgroundImage: `url(${logo})` }}
>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      
      <Card className="w-full max-w-lg relative z-10 overflow-hidden border-white/10 shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
             <img src={logo} alt="" />
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Welcome Back
          </h2>
          <p className="text-slate-400 mt-2">Sign in to access your dashboard</p>
        </div>

        {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm text-center">
              {error}
            </div>
        )}

        <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6 border border-white/5">
            <button 
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${form.role === 'member' ? 'bg-indigo-500/10 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setForm({ ...form, role: 'member' })}
            >
                <Users size={16} /> Member
            </button>
            <button 
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${form.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setForm({ ...form, role: 'admin' })}
            >
                <ShieldCheck size={16} /> Admin
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              icon={User}
              placeholder={form.role === 'admin' ? 'Admin Username' : 'Username / Phone'}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Button type="submit" className="w-full" isLoading={loading}>
              Sign In <ArrowRight size={18} className="ml-2" />
            </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account?{' '}
            <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" onClick={onSwitchToRegister}>
              Create Account
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginScreen;
