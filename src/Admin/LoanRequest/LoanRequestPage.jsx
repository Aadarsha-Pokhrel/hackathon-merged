import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Coins, CheckCircle, XCircle, Clock, Check, X, History, Activity } from "lucide-react";

const API = "http://localhost:8080";

export function LoanRequestPage() {
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // Fetch ALL data from backend
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const authHeader = { headers: { Authorization: `Bearer ${token}` } };
      setLoading(true);

      try {
        const [reqRes, histRes, loanRes] = await Promise.all([
          axios.get(`${API}/admin/loan-requests`, authHeader),
          axios.get(`${API}/admin/loan-history`, authHeader),
          axios.get(`${API}/admin/loans/active`, authHeader),
        ]);

        setRequests((reqRes.data || []).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setHistory((histRes.data || []).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));

        const enrichedLoans = (loanRes.data || [])
            .map((l) => {
              const fromHistory = histRes.data.find(
                (h) => h.loanReqId === l.id || h.loanId === l.id
              );
              return {
                ...l,
                users: fromHistory?.users ?? l.users,
                principal: fromHistory?.Amount ?? l.principal,
                startDate: l.startDate ?? fromHistory?.createdAt,
              };
            })
            .sort((a,b) => new Date(b.startDate) - new Date(a.startDate)); // Latest active loans first

        setLoans(enrichedLoans);
      } catch (err) {
        console.error("Failed to load loans:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // call once on mount
  }, []);

  // -----------------------------
  // Approve / Reject Loan
  // -----------------------------
  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const res = await axios.post(`${API}/admin/${action}/${id}`, {}, authHeader);

      const approvedRequest = requests.find((r) => r.loanReqId === id);
      setRequests((prev) => prev.filter((r) => r.loanReqId !== id));

      const newHistoryItem = {
        loanReqId: id,
        users: approvedRequest?.users ?? res.data.users,
        Amount:
          res.data.Amount ?? approvedRequest?.Amount ?? res.data.principal,
        status: action === "approve" ? "Approved" : "Rejected",
        createdAt: res.data.startDate ?? res.data.createdAt ?? new Date().toISOString(),
      };

      setHistory((prev) => [...prev, newHistoryItem]);
    } catch (err) {
      console.error(`Failed to ${action} loan`, err);
    }
  };

  // -----------------------------
  // Mark loan as paid
  // -----------------------------
  const markAsPaid = async (loanId, userId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.post(`${API}/admin/loans/${loanId}/${userId}/mark-paid`, {}, authHeader);
      // Refresh data
      // For simplicity in this new version, ideally we would optimistically update state
      // But re-fetching is safer for data consistency
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to mark loan as paid", err);
    }
  };

  // -----------------------------
  // Time formatter
  // -----------------------------
  const timeAgo = (date) => {
    if (!date) return "";
    const diff = (new Date() - new Date(date)) / 1000; // Removed extra processing, assuming ISO from backend
    if (isNaN(diff)) {
        // Fallback for different date formats if needed
        const diff2 = (new Date() - new Date(date + "T00:00:00")) / 1000;
        if (!isNaN(diff2)) return formatDiff(diff2);
        return date;
    }
    return formatDiff(diff);
  };

  const formatDiff = (diff) => {
    if (diff < 60) return `${Math.max(0, Math.floor(diff))}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Loading dashboard...</div>;

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
         <Coins className="text-amber-400" /> Loan Management
      </h1>

      {/* Pending Requests */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Clock size={16} className="text-sky-400" /> Pending Requests
            <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                {requests.filter(r => r.status === 'pending').length}
            </span>
        </h2>
        {requests.filter(r => r.status === 'pending').length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10 text-slate-500 text-sm">
                No pending requests
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {requests.map(
                (r, index) =>
                    r.status === "pending" && (
                    <Card key={`req-${r.loanReqId ?? index}`} className="border-sky-500/20 shadow-sky-500/5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-bold text-white text-lg">{r.users?.name || "Unknown"}</p>
                                <p className="text-xs text-slate-400">{timeAgo(r.createdAt)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">₹ {r.Amount?.toLocaleString() ?? "N/A"}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Requested</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 border-emerald-600" onClick={() => handleAction(r.loanReqId, "approve")}>
                            <Check size={16} className="mr-1" /> Approve
                        </Button>
                        <Button className="flex-1" variant="danger" onClick={() => handleAction(r.loanReqId, "reject")}>
                            <X size={16} className="mr-1" /> Reject
                        </Button>
                        </div>
                    </Card>
                    )
                )}
            </div>
        )}
      </section>

      {/* Active Loans */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" /> Active Loans
        </h2>
        {loans.filter(l => (l.status === "ACTIVE" || l.status === "Approved") && l.status !== "Rejected").length === 0 ? (
            <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10 text-slate-500 text-sm">
                No active loans
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loans.map(
                (l, index) =>
                    (l.status === "ACTIVE" || l.status === "Approved") && l.status !== "Rejected" && (
                    <Card key={`loan-${index}`} className="border-emerald-500/20 shadow-emerald-500/5 hover:bg-emerald-500/5 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="font-bold text-white text-lg">{l.users?.name || "Unknown"}</p>
                                <p className="text-xs text-slate-400">Since {timeAgo(l.startDate)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-400">₹ {l.principal?.toLocaleString() ?? "N/A"}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Principal</p>
                            </div>
                        </div>
                        <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white font-semibold py-3" onClick={() => markAsPaid(l.id, l.users?.userID)}>
                            <CheckCircle size={18} className="mr-2" /> Mark as Paid
                        </Button>
                    </Card>
                    )
                )}
            </div>
        )}
      </section>

      {/* Loan History */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
             <History size={16} className="text-slate-400" /> Loan History
        </h2>
        
        <div className="bg-slate-900/50 rounded-xl overflow-hidden border border-white/5">
            {history.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">No loan history</div>
            ) : (
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/5 text-slate-400 font-medium">
                        <tr>
                            <th className="px-4 py-3">Borrower</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                        {history.map((h, index) => (
                        <tr key={`history-${index}`} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 font-medium text-white">{h.users?.name || "Unknown"}</td>
                            <td className="px-4 py-3">₹ {h.Amount?.toLocaleString() ?? "N/A"}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    h.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                    h.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                    'bg-slate-500/10 text-slate-400'
                                }`}>
                                    {h.status === 'Approved' ? <CheckCircle size={10} /> : h.status === 'Rejected' ? <XCircle size={10} /> : null}
                                    {h.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{timeAgo(h.createdAt)}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </section>
    </div>
  );
}