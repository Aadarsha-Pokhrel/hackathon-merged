import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Calendar, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

const API = "http://localhost:8080";

const Loans = () => {
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const skeletonVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({ opacity: 1, transition: { delay: i * 0.1, duration: 0.4 } })
  };

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/my-loan-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const historyData = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLoanHistory(historyData);
      } catch (err) {
        console.error("Error fetching loan history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanHistory();
  }, []);

  // Helper to calculate due date (+1 month)
  const getDueDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          My Loan History
        </h2>
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400 border border-white/5"
        >
          {loanHistory.length} Record(s)
        </motion.span>
      </motion.div>

      {/* Content */}
      {loading ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={skeletonVariants}
              className="h-32 bg-slate-800/50 rounded-xl animate-pulse"
            />
          ))}
        </motion.div>
      ) : loanHistory.length === 0 ? (
        <motion.div 
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-slate-500">No past loans found.</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {loanHistory.map((loan, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index === 0 ? 0 : 0.1 * index }} // ✅ first card animates immediately
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="flex flex-col md:flex-row gap-6 hover:bg-slate-800/50 transition-colors relative overflow-hidden group">
                
                {/* Animated background glow */}
                <motion.div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className={`w-full h-full rounded-full blur-2xl ${
                    loan.status === "Approved"
                      ? "bg-emerald-500"
                      : loan.status === "Rejected"
                      ? "bg-rose-500"
                      : "bg-amber-500"
                  }`}></div>
                </motion.div>

                {/* LEFT */}
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.h3 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-lg font-bold text-white"
                    >
                      {loan.purpose}
                    </motion.h3>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        loan.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : loan.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {loan.status}
                    </motion.span>
                  </div>

                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-sm text-slate-400 flex items-center gap-2"
                  >
                    <Calendar size={14} />
                    Approved: <span className="text-slate-300">{loan.createdAt?.split("T")[0]}</span>
                  </motion.p>
                </div>

                {/* RIGHT */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-auto bg-slate-900/40 p-4 rounded-xl border border-white/5 relative z-10"
                >
                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Principal</p>
                    <p className="text-lg font-bold text-white">NPR {loan.Amount?.toLocaleString()}</p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Borrower</p>
                    <p className="text-sm font-medium text-slate-300 mt-1 flex items-center gap-1">
                      <User size={14} /> {loan.users?.name}
                    </p>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Due</p>
                    <p className="text-sm font-medium text-slate-300 mt-1 flex items-center gap-1">
                      <Clock size={14} /> {getDueDate(loan.createdAt)}
                    </p>
                  </motion.div>
                </motion.div>

              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Loans;
