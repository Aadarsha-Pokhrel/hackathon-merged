import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Coins,
  Clock,
  Check,
  X,
  Activity,
  History,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const API = "http://localhost:8080";

export function LoanRequestPage() {
  const [requests, setRequests] = useState([]);
  const [loans, setLoans] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingLoan, setProcessingLoan] = useState(null);

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  /* -------------------- helpers -------------------- */
  const timeAgo = (date) => {
    if (!date) return "";
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  /* -------------------- fetch -------------------- */
  const fetchData = async () => {
    try {
      const [reqRes, loanRes, histRes] = await Promise.all([
        axios.get(`${API}/admin/loan-requests`, authHeader),
        axios.get(`${API}/admin/loans/active`, authHeader),
        axios.get(`${API}/admin/loan-history`, authHeader),
      ]);

      setRequests(reqRes.data ?? []);
      setLoans(loanRes.data ?? []);
      setHistory(histRes.data ?? []);
    } catch (e) {
      console.error("Failed to load loan data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* -------------------- approve / reject -------------------- */
  const handleAction = async (loanReqId, action) => {
    setProcessingLoan(loanReqId);

    try {
      await axios.post(
        `${API}/admin/${action}/${loanReqId}`,
        {},
        authHeader,
      );

      // ✅ GUARANTEED FIX — FULL PAGE REFRESH
      window.location.reload();

    } catch (e) {
      console.error(`Failed to ${action} loan`, e);
      setProcessingLoan(null);
    }
  };

  /* -------------------- mark paid -------------------- */
  const markAsPaid = async (loanId, userId) => {
    try {
      await axios.post(
        `${API}/admin/loans/${loanId}/${userId}/mark-paid`,
        {},
        authHeader,
      );
      window.location.reload();
    } catch (e) {
      console.error("Failed to mark paid", e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.h1 
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="text-2xl font-bold text-white flex items-center gap-2"
      >
        <Coins className="text-amber-400" /> Loan Management
      </motion.h1>

      {/* ---------------- Pending ---------------- */}
      <section>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-2 text-slate-300 mb-3"
        >
          <Clock size={16} /> Pending Requests
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {requests
            .filter(r => r.status === "pending")
            .map(r => (
              <motion.div
                key={r.loanReqId}
                variants={cardVariants}
              >
                <Card>
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="font-bold text-white">
                        {r.users?.name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {timeAgo(r.createdAt)}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-white">
                      NPR {r.Amount?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-500"
                      disabled={processingLoan === r.loanReqId}
                      onClick={() => handleAction(r.loanReqId, "approve")}
                    >
                      <Check size={16} /> Approve
                    </Button>
                    <Button
                      variant="danger"
                      className="flex-1"
                      disabled={processingLoan === r.loanReqId}
                      onClick={() => handleAction(r.loanReqId, "reject")}
                    >
                      <X size={16} /> Reject
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
        </motion.div>
      </section>

      {/* ---------------- Active ---------------- */}
      <section>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center gap-2 text-slate-300 mb-3"
        >
          <Activity size={16} /> Active Loans
        </motion.h2>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {loans.map(l => (
            <motion.div
              key={l.id}
              variants={cardVariants}
            >
              <Card className="border-emerald-500/20">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-bold text-white">
                      {l.users?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Since {timeAgo(l.startDate)}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">
                    NPR {l.principal?.toLocaleString()}
                  </p>
                </div>

                <Button
                  className="w-full bg-emerald-600"
                  onClick={() =>
                    markAsPaid(l.id, l.users?.userID)
                  }
                >
                  <CheckCircle size={16} /> Mark as Paid
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------------- History ---------------- */}
      <section>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex items-center gap-2 text-slate-300 mb-3"
        >
          <History size={16} /> Loan History
        </motion.h2>

        <motion.div 
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-xl border border-white/5"
        >
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="p-3">Borrower</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-white/5"
            >
              {history.map(h => (
                <motion.tr 
                  key={h.id}
                  variants={rowVariants}
                >
                  <td className="p-3 text-white">{h.users?.name}</td>
                  <td className="p-3">
                    NPR {h.Amount?.toLocaleString()}
                  </td>
                  <td className="p-3">
                    {h.status === "Approved" && <CheckCircle size={12} />}
                    {h.status === "Rejected" && <XCircle size={12} />}
                    {h.status}
                  </td>
                  <td className="p-3 text-slate-500">
                    {timeAgo(h.createdAt)}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      </section>
    </div>
  );
}