import { useState } from "react";
import { loanRequests as initialRequests, loanHistory as initialHistory ,loans as initialLoan} from "./loans.js";
import "./LoanRequestPage.css";

export function LoanRequestPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [history, setHistory] = useState(initialHistory);
  const [loans,setLoan] = useState(initialLoan);

  // Sort state
  const [requestSort, setRequestSort] = useState("latest");
  const [historySort, setHistorySort] = useState("latest");

  function timeAgo(date) {
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function handleAction(r, action) {
  const updatedRequest = { ...r, status: action };

  if (action === "approved") {
    setLoan(prevLoans => [
      {
        id: r.id,
        name: r.name,
        amount: r.amount,
        dateTaken: r.dateRequested,
      },
      ...prevLoans,
    ]);
  }

  setHistory(prev => [updatedRequest, ...prev]);
  setRequests(prev => prev.filter(request => request.id !== r.id));
}


  function markAsPaid(id) {
    setHistory(history.map(r => r.id === id ? { ...r, status: "paid" } : r));
  }

  // Sorting functions
  const sortedRequests = [...requests].sort((a, b) => {
    if (requestSort === "latest") return new Date(b.dateRequested) - new Date(a.dateRequested);
    if (requestSort === "oldest") return new Date(a.dateRequested) - new Date(b.dateRequested);
    if (requestSort === "highest") return b.amount - a.amount;
    if (requestSort === "lowest") return a.amount - b.amount;
    return 0;
  });

  const sortedHistory = [...history].sort((a, b) => {
    if (historySort === "latest") return new Date(b.dateRequested) - new Date(a.dateRequested);
    if (historySort === "oldest") return new Date(a.dateRequested) - new Date(b.dateRequested);
    if (historySort === "highest") return b.amount - a.amount;
    if (historySort === "lowest") return a.amount - b.amount;
    return 0;
  });

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
        {sortedRequests.map(r => (
          <div key={r.id} className="loan-card">
            <p className="loan-name">{r.name}</p>
            <p className="loan-amount">₹ {r.amount}</p>
            <p className="loan-time">{timeAgo(r.dateRequested)}</p>
            <div className="loan-actions">
              <button className="accept" onClick={() => handleAction(r, "approved")}>Accept</button>
              <button className="reject" onClick={() => handleAction(r, "rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </section>

      <h2 className="section-title">Active Loans Taken</h2>
      <div className="loan-list">
        {loans.map((loan) => (
          <div key={loan.id} className="loan-card">
            <p className="loan-name">{loan.name}</p>
            <p className="loan-amount">₹ {loan.amount}</p>
            <p className="loan-time">{timeAgo(loan.dateTaken)}</p>
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
        {sortedHistory.map(r => (
          <div key={r.id} className={`loan-card ${r.status}`}>
            <p className="loan-name">{r.name}</p>
            <p className="loan-amount">₹ {r.amount}</p>
            <p className="loan-status">{r.status.toUpperCase()}</p>
            <p className="loan-time">{timeAgo(r.dateRequested)}</p>
            {r.status === "approved" && (
              <button className="paid-btn" onClick={() => markAsPaid(r.id)}>Mark as Paid</button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
