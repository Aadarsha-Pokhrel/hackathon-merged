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
import "./AdminDashboard.css";

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

        const approved = historyRes.data.filter((h) => h.status === "Approved")
          .length;
        const rejected = historyRes.data.filter((h) => h.status === "Rejected")
          .length;
        const active = activeLoansRes.data.length;

        setLoanData([
          { name: "Approved", value: approved },
          { name: "Rejected", value: rejected },
          { name: "Active", value: active },
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
  }, []); // run once on mount

  const COLORS = ["#4CAF50", "#FF5722", "#2196F3"];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p className="welcome">Welcome back, Admin 👋</p>

      {/* Summary Cards */}
      <div className="cards">
        <div className="card active-loans">
          <h3>Active Loans</h3>
          <p>{stats.activeLoans}</p>
        </div>
        <div className="card pending-requests">
          <h3>Pending Requests</h3>
          <p>{stats.pendingRequests}</p>
        </div>
        <div className="card notices">
          <h3>Notices</h3>
          <p>{stats.notices}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="charts">
        <h3>Loan Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={loanData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {loanData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p>No recent activity</p>
        ) : (
          <ul>
            {recentActivity.map((act, idx) => (
              <li key={idx}>
                {act.user} - ₹{act.amount} ({act.status}) -{" "}
                {new Date(act.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}