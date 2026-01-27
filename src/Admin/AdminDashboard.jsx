import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { ArrowUpRight } from "lucide-react";

const API = "http://localhost:8080";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    activeLoans: 0,
    pendingRequests: 0,
    notices: 0,
  });

  const [loanData, setLoanData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const authHeader = { headers: { Authorization: `Bearer ${token}` } };

      try {
        const [activeLoansRes, requestsRes, noticesRes, historyRes] =
          await Promise.all([
            axios.get(`${API}/admin/loans/active`, authHeader),
            axios.get(`${API}/admin/loan-requests`, authHeader),
            axios.get(`${API}/notice`, authHeader),
            axios.get(`${API}/admin/loan-history`, authHeader),
          ]);

        setStats({
          activeLoans: activeLoansRes.data.length,
          pendingRequests: requestsRes.data.filter((r) => r.status === "pending")
            .length,
          notices: noticesRes.data.length,
        });

        const paid = historyRes.data.filter((h) => h.status?.toLowerCase() === "paid").length;
        const rejected = historyRes.data.filter((h) => h.status?.toLowerCase() === "rejected").length;
        const active = activeLoansRes.data.length;

        setLoanData([
          { name: "Active", value: active },
          { name: "Paid", value: paid },
          { name: "Rejected", value: rejected },
        ]);

        const recent = historyRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((h) => ({
            user: h.users?.name ?? "Unknown",
            amount: h.Amount,
            status: h.status,
            date: h.createdAt,
          }));

        setRecentActivity(recent);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#f43f5e"]; // emerald (Active), blue (Paid), rose (Rejected)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back, Admin 👋</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-20 h-20 bg-indigo-500 rounded-full blur-2xl"></div>
          </div>
          <h3 className="text-slate-400 font-medium text-sm">Active Loans</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.activeLoans}</p>
          <div className="mt-4 flex items-center text-sm text-indigo-400">
            <ArrowUpRight size={16} className="mr-1" /> Built for growth
          </div>
        </Card>

        <Card hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-20 h-20 bg-amber-500 rounded-full blur-2xl"></div>
          </div>
          <h3 className="text-slate-400 font-medium text-sm">Pending Requests</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.pendingRequests}</p>
          <div className="mt-4 flex items-center text-sm text-amber-400">
            Needs attention
          </div>
        </Card>

        <Card hoverEffect className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="w-20 h-20 bg-cyan-500 rounded-full blur-2xl"></div>
          </div>
          <h3 className="text-slate-400 font-medium text-sm">Notices</h3>
          <p className="text-4xl font-bold text-white mt-2">{stats.notices}</p>
          <div className="mt-4 flex items-center text-sm text-cyan-400">
            Broadcasts active
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Loan Status Distribution</h3>
          {/* Explicit height and min-height container to prevent Recharts width(-1) error */}
          <div style={{ width: '100%', height: 300, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  stroke="none"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {loanData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No recent activity found.</div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${act.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        act.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-700 text-slate-300'
                      }`}>
                      {act.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{act.user}</p>
                      <p className="text-xs text-slate-500">{new Date(act.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">₹{act.amount.toLocaleString()}</p>
                    <p className={`text-xs capitalize ${act.status === 'Approved' ? 'text-emerald-400' :
                        act.status === 'Rejected' ? 'text-rose-400' :
                          'text-slate-400'
                      }`}>{act.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}