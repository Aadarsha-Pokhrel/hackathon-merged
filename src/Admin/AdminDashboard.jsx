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
import { ArrowUpRight, TrendingUp, Clock, Bell } from "lucide-react";
import { motion } from "framer-motion";

const API = "http://localhost:8080";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    activeLoans: 0,
    pendingRequests: 0,
    notices: 0,
  });

  const [loanData, setLoanData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const statCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const chartContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6,
      }
    }
  };

  const chartCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const activityItemVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#f43f5e"]; // emerald (Active), blue (Paid), rose (Rejected)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Admin Dashboard
        </h1>
        <p className="text-slate-400 mt-1">Welcome back, Admin 👋</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={statCardVariants}>
          <Card hoverEffect className="relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-20 h-20 bg-indigo-500 rounded-full blur-2xl"></div>
            </motion.div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium text-sm">Active Loans</h3>
                <TrendingUp className="text-indigo-400" size={20} />
              </div>
              <motion.p 
                variants={numberVariants}
                className="text-4xl font-bold text-white mt-2"
              >
                {stats.activeLoans}
              </motion.p>
              <div className="mt-4 flex items-center text-sm text-indigo-400">
                <ArrowUpRight size={16} className="mr-1" /> Built for growth
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={statCardVariants}>
          <Card hoverEffect className="relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -90, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="w-20 h-20 bg-amber-500 rounded-full blur-2xl"></div>
            </motion.div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium text-sm">Pending Requests</h3>
                <Clock className="text-amber-400" size={20} />
              </div>
              <motion.p 
                variants={numberVariants}
                className="text-4xl font-bold text-white mt-2"
              >
                {stats.pendingRequests}
              </motion.p>
              <div className="mt-4 flex items-center text-sm text-amber-400">
                {stats.pendingRequests > 0 ? "Needs attention" : "All clear"}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={statCardVariants}>
          <Card hoverEffect className="relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="w-20 h-20 bg-cyan-500 rounded-full blur-2xl"></div>
            </motion.div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium text-sm">Notices</h3>
                <Bell className="text-cyan-400" size={20} />
              </div>
              <motion.p 
                variants={numberVariants}
                className="text-4xl font-bold text-white mt-2"
              >
                {stats.notices}
              </motion.p>
              <div className="mt-4 flex items-center text-sm text-cyan-400">
                Broadcasts active
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={chartContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Pie Chart */}
        <motion.div variants={chartCardVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Loan Status Distribution
            </h3>
            {/* Explicit height and min-height container to prevent Recharts width(-1) error */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              style={{ width: '100%', height: 300, minHeight: 300 }}
            >
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
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {loanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #ffffff10', 
                      borderRadius: '8px' 
                    }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={chartCardVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-slate-500"
              >
                No recent activity found.
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.2
                    }
                  }
                }}
              >
                {recentActivity.map((act, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={activityItemVariants}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          act.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                          act.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' :
                          'bg-slate-700 text-slate-300'
                        }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {act.user.charAt(0)}
                      </motion.div>
                      <div>
                        <p className="font-medium text-slate-200">{act.user}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(act.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">
                        NPR {act.amount.toLocaleString()}
                      </p>
                      <p className={`text-xs capitalize ${
                        act.status === 'Approved' ? 'text-emerald-400' :
                        act.status === 'Rejected' ? 'text-rose-400' :
                        'text-slate-400'
                      }`}>
                        {act.status}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}