import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";
import { User, Lock, Phone, ArrowRight, ShieldCheck, Users } from 'lucide-react';

const RegisterScreen = ({ onRegister, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    name: "",
    phonenumber: "",
    password: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.phonenumber || !form.password || !form.role) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await onRegister(form);
      setSuccess("Registration successful! Logging you in...");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>

      <Card className="w-full max-w-lg relative z-10 overflow-hidden border-white/10 shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
           <p className="text-slate-400 mt-2">Join us and manage your finances</p>
        </div>

        {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm text-center">
              {error}
            </div>
        )}
        {success && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm text-center">
              {success}
            </div>
        )}

        <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6 border border-white/5">
            <button 
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${form.role === 'USER' ? 'bg-indigo-500/10 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setForm({ ...form, role: "USER" })}
            >
                <Users size={16} /> Member
            </button>
            <button 
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${form.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setForm({ ...form, role: "ADMIN" })}
            >
                <ShieldCheck size={16} /> Admin
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name"
            icon={User}
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input 
            label="Phone Number"
            icon={Phone}
            placeholder="98XXXXXXXX"
            value={form.phonenumber}
            onChange={(e) => setForm({ ...form, phonenumber: e.target.value })}
          />

          <Input 
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button type="submit" className="w-full mt-2" isLoading={loading}>
            Create Account <ArrowRight size={18} className="ml-2" />
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Already have an account?{" "}
            <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" onClick={onSwitchToLogin} type="button">
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RegisterScreen;
