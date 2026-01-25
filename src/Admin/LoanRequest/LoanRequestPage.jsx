import { useState, useEffect } from "react";
import axios from "axios";
import "./LoanRequestPage.css";

export function LoanRequestPage() {
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loans, setLoans] = useState([]);

  const [requestSort, setRequestSort] = useState("latest");
  const [historySort, setHistorySort] = useState("latest");

  const token = localStorage.getItem("token"); // JWT token

  // -----------------------------
  // Format backend LoanRequest
  // -----------------------------
  const formatLoanRequest = (loan) => ({
    id: loan.loanReqId,
    name: loan.users?.name || "Unknown", // backend field is `users`
    amount: loan.Amount || 0,            // backend field is `Amount`
    dateRequested: loan.createdAt,
    status: loan.status?.toUpperCase() || "PENDING",
  });

  // Format backend active Loan
  const formatActiveLoan = (loan) => ({
    id: loan.loanId,
    name: loan.users?.name || "Unknown",
    amount: loan.Amount || 0,
    dateRequested: loan.createdAt || loan.startDate,
    status: "APPROVED",
  });

  // -----------------------------
  // Fetch data from backend
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Pending + history from loan requests
        const resRequests = await axios.get(
          "http://localhost:8080/admin/loan-requests",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allRequests = (resRequests.data || []).map(formatLoanRequest);

        setRequests(allRequests.filter((r) => r.status === "PENDING"));
        setHistory(allRequests.filter((r) => r.status !== "PENDING"));

        // 2️⃣ Active loans
        const resActive = await axios.get(
          "http://localhost:8080/admin/loans/active",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const activeLoans = (resActive.data || []).map(formatActiveLoan);
        setLoans(activeLoans);
      } catch (err) {
        console.error("Failed to fetch loans:", err);
      }
    };

    fetchData();
  }, []);

  // -----------------------------
  // Time ago formatting
  // -----------------------------
  const timeAgo = (date) => {
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // -----------------------------
  // Approve / Reject loan
  // -----------------------------
  const handleAction = async (loan, action) => {
    try {
      const endpoint =
        action === "APPROVED"
          ? `http://localhost:8080/admin/approve/${loan.id}`
          : `http://localhost:8080/admin/reject/${loan.id}`;

      await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });

      // Update frontend state
      if (action === "APPROVED") {
        setLoans(prev => [{ ...loan, status: "APPROVED" }, ...prev]);
      }
      setRequests(prev => prev.filter(r => r.id !== loan.id));
      setHistory(prev => [{ ...loan, status: action }, ...prev]);
    } catch (err) {
      console.error(`Failed to ${action} loan:`, err);
    }
  };

  // -----------------------------
  // Mark loan as paid
  // -----------------------------
  const markAsPaid = (id) => {
    // Remove from active loans
    const paidLoan = loans.find(l => l.id === id);
    if (!paidLoan) return;

    setLoans(prev => prev.filter(l => l.id !== id));

    // Add to history with status PAID
    setHistory(prev => [{ ...paidLoan, status: "PAID" }, ...prev]);
  };

  // -----------------------------
  // Sorting
  // -----------------------------
  const sortItems = (items, sort, dateKey = "dateRequested") => {
    return [...items].sort((a, b) => {
      if (sort === "latest") return new Date(b[dateKey]) - new Date(a[dateKey]);
      if (sort === "oldest") return new Date(a[dateKey]) - new Date(b[dateKey]);
      if (sort === "highest") return b.amount - a.amount;
      if (sort === "lowest") return a.amount - b.amount;
      return 0;
    });
  };

  const sortedRequests = sortItems(requests, requestSort);
  const sortedHistory = sortItems(history, historySort);

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="loan-page">
      <h1 className="page-title">💸 Loan Requests</h1>

      {/* Pending Requests */}
      <section className="pending-section">
        <div className="section-header">
          <h2>Pending Requests</h2>
          <select value={requestSort} onChange={(e) => setRequestSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
        {sortedRequests.length === 0 && <p>No pending requests</p>}
        {sortedRequests.map((r) => (
          <div key={r.id} className="loan-card">
            <p className="loan-name">{r.name}</p>
            <p className="loan-amount">₹ {r.amount}</p>
            <p className="loan-time">{timeAgo(r.dateRequested)}</p>
            <div className="loan-actions">
              <button className="accept" onClick={() => handleAction(r, "APPROVED")}>Accept</button>
              <button className="reject" onClick={() => handleAction(r, "REJECTED")}>Reject</button>
            </div>
          </div>
        ))}
      </section>

      {/* Active Loans */}
      <h2 className="section-title">Active Loans Taken</h2>
      <div className="loan-list">
        {loans.map((l) => (
          <div key={l.id} className="loan-card">
            <p className="loan-name">{l.name}</p>
            <p className="loan-amount">₹ {l.amount}</p>
            <p className="loan-time">{timeAgo(l.dateRequested)}</p>
            <button className="paid-btn" onClick={() => markAsPaid(l.id)}>Mark as Paid</button>
          </div>
        ))}
      </div>

      {/* Loan History */}
      <section className="history-section">
        <div className="section-header">
          <h2>Loan History</h2>
          <select value={historySort} onChange={(e) => setHistorySort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
        {sortedHistory.length === 0 && <p>No history yet</p>}
        {sortedHistory.map((r) => (
          <div key={r.id} className={`loan-card ${r.status}`}>
            <p className="loan-name">{r.name}</p>
            <p className="loan-amount">₹ {r.amount}</p>
            <p className="loan-status">{r.status}</p>
            <p className="loan-time">{timeAgo(r.dateRequested)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}