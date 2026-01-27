import { useEffect, useState } from "react";
import axios from "axios";
import "./Loans.css";

const API = "http://localhost:8080";

const Loans = () => {
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/my-loan-history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoanHistory(res.data);
      } catch (err) {
        console.error("Error fetching loan history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanHistory();
  }, []);

  if (loading) {
    return <p className="no-loans-text">Loading loan history...</p>;
  }

  return (
    <div className="active-loans-container">
      <h2 className="active-loans-title">My Loan History</h2>

      {loanHistory.length === 0 ? (
        <p className="no-loans-text">No past loans found.</p>
      ) : (
        <div className="loan-cards-wrapper">
          {loanHistory.map((loan, index) => (
            <div className="loan-card" key={index}>
              {/* Header */}
              <div className="loan-card-header">
                <div>
                  <h3 className="loan-title">{loan.purpose}</h3>
                  <p className="loan-approved-date">
                    Approved: {loan.createdAt}
                  </p>
                </div>

                <span className="loan-status">{loan.status}</span>
              </div>

              {/* Loan details */}
              <div className="loan-details-container">
                <div className="loan-detail">
                  <p className="loan-label">Principal Amount</p>
                  <p className="loan-value">
                    NPR {loan.Amount?.toLocaleString()}
                  </p>
                </div>

                <div className="loan-detail">
                  <p className="loan-label">Borrower</p>
                  <p className="loan-value">
                    {loan.users?.name}
                  </p>
                </div>

                <div className="loan-detail">
                  <p className="loan-label">Due Date</p>
                  <p className="loan-value">
                    After one month
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Loans;