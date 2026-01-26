import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./LoanRequestPage.css";

const API = "http://localhost:8080";

export function LoanRequestPage() {
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loans, setLoans] = useState([]);

  // -----------------------------
  // Fetch ALL data from backend
  // -----------------------------
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [reqRes, histRes, loanRes] = await Promise.all([
        axios.get(`${API}/admin/loan-requests`, authHeader),
        axios.get(`${API}/admin/loan-history`, authHeader),
        axios.get(`${API}/admin/loans/active`, authHeader),
      ]);

      setRequests(reqRes.data || []);
      setHistory(histRes.data || []);

      const enrichedLoans = (loanRes.data || []).map((l) => {
        const fromHistory = histRes.data.find(
          (h) => h.loanReqId === l.id || h.loanId === l.id
        );
        return {
          ...l,
          users: fromHistory?.users ?? l.users,
          principal: fromHistory?.Amount ?? l.principal,
          startDate: l.startDate ?? fromHistory?.createdAt,
        };
      });

      setLoans(enrichedLoans);
    } catch (err) {
      console.error("Failed to load loans:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // -----------------------------
  // Approve / Reject Loan
  // -----------------------------
  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const res = await axios.post(
        `${API}/admin/${action}/${id}`,
        {},
        authHeader
      );

      const approvedRequest = requests.find((r) => r.loanReqId === id);
      setRequests((prev) => prev.filter((r) => r.loanReqId !== id));

      if (action === "approve") {
        setHistory((prev) => [
          ...prev,
          {
            loanReqId: id,
            users: approvedRequest?.users ?? res.data.users,
            Amount:
              res.data.Amount ??
              approvedRequest?.Amount ??
              res.data.principal,
            status: "Approved",
            createdAt: res.data.startDate ?? new Date().toISOString(),
          },
        ]);
      }

      if (action === "reject") {
        setHistory((prev) => [
          ...prev,
          {
            loanReqId: id,
            users: approvedRequest?.users ?? res.data.users,
            Amount: res.data.Amount ?? approvedRequest?.Amount,
            status: "Rejected",
            createdAt: res.data.createdAt ?? new Date().toISOString(),
          },
        ]);
      }

      // 🔥 FIX: sync UI with backend
      await fetchData();

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
      await axios.post(
        `${API}/admin/loans/${loanId}/${userId}/mark-paid`,
        {},
        authHeader
      );

      // 🔥 FIX: sync UI with backend
      await fetchData();

    } catch (err) {
      console.error("Failed to mark loan as paid", err);
    }
  };

  // -----------------------------
  // Time formatter
  // -----------------------------
  const timeAgo = (date) => {
    if (!date) return "";
    const diff = (new Date() - new Date(date + "T00:00:00")) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="loan-page">
      <h1 className="page-title">💸 Loan Requests</h1>

      {/* Pending Requests */}
      <section>
        <h2>Pending Requests</h2>
        {requests.length === 0 && <p>No pending requests</p>}
        {requests.map(
          (r, index) =>
            r.status === "pending" && (
              <div key={`req-${r.loanReqId ?? index}`} className="loan-card">
                <p className="loan-name">{r.users?.name || "Unknown"}</p>
                <p className="loan-amount">₹ {r.Amount ?? "N/A"}</p>
                <p className="loan-time">{timeAgo(r.createdAt)}</p>
                <div className="loan-actions">
                  <button
                    className="accept"
                    onClick={() =>
                      handleAction(r.loanReqId, "approve")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="reject"
                    onClick={() =>
                      handleAction(r.loanReqId, "reject")
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            )
        )}
      </section>

      {/* Active Loans */}
      <section>
        <h2>Active Loans</h2>
        {loans.length === 0 && <p>No active loans</p>}
        {loans.map(
          (l, index) =>
            l.status === "ACTIVE" && (
              <div key={`loan-${index}`} className="loan-card">
                <p className="loan-name">{l.users?.name || "Unknown"}</p>
                <p className="loan-amount">₹ {l.principal ?? "N/A"}</p>
                <p className="loan-time">{timeAgo(l.startDate)}</p>
                <button
                  className="paid-btn"
                  onClick={() =>
                    markAsPaid(l.id, l.users?.userID)
                  }
                >
                  Mark as Paid
                </button>
              </div>
            )
        )}
      </section>

      {/* Loan History */}
      <section>
        <h2>Loan History</h2>
        {history.length === 0 && <p>No loan history</p>}
        {history.map((h, index) => (
          <div
            key={`history-${index}`}
            className={`loan-card ${h.status?.toLowerCase()}`}
          >
            <p className="loan-name">{h.users?.name || "Unknown"}</p>
            <p className="loan-amount">₹ {h.Amount ?? "N/A"}</p>
            <p className="loan-status">Status: {h.status}</p>
            <p className="loan-time">{timeAgo(h.createdAt)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}