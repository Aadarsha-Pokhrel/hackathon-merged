import React from "react";
import "./LoanCard.css";

const LoanCard = ({ loan }) => {
  return (
    <div className="loan-card">
      {/* Header */}
      <div className="loan-card-header">
        <div>
          <h3 className="loan-title">{loan.purpose}</h3>
          <p className="loan-approved-date">
            Approved: {loan.approvedDate}
          </p>
        </div>

        <span className="loan-status">Active</span>
      </div>

      {/* Loan details */}
      <div className="loan-details-container">
        <div className="loan-detail">
          <p className="loan-label">Principal Amount</p>
          <p className="loan-value">
            NPR {loan.amount.toLocaleString()}
          </p>
        </div>

        <div className="loan-detail">
          <p className="loan-label">Interest Rate</p>
          <p className="loan-value">
            {loan.interestRate}% per year
          </p>
        </div>

        <div className="loan-detail">
          <p className="loan-label">Duration</p>
          <p className="loan-value">
            {loan.duration} months
          </p>
        </div>

        <div className="loan-detail">
          <p className="loan-label">Due Date</p>
          <p className="loan-value">
            {loan.dueDate}
          </p>
        </div>
      </div>

      {/* Repayment section */}
      <div className="repayment-box">
        <div className="repayment-header">
          <span className="repayment-title">Repayment Status</span>
          <span className="repayment-type">
            {loan.repaymentType === "monthly"
              ? "Monthly Installments"
              : "Lump Sum at End"}
          </span>
        </div>

        <div className="repayment-details">
          <div className="repayment-row">
            <span>Paid:</span>
            <span className="paid-amount">
              NPR {loan.paidAmount.toLocaleString()}
            </span>
          </div>

          <div className="repayment-row">
            <span>Remaining Principal:</span>
            <span className="remaining-amount">NPR </span>
          </div>

          <div className="repayment-row">
            <span>Total Interest:</span>
            <span className="interest-amount">NPR </span>
          </div>

          <div className="repayment-row repayment-total">
            <span>
              {loan.repaymentType === "monthly"
                ? "Monthly Payment:"
                : "Monthly Interest:"}
            </span>
            <span className="monthly-payment">NPR </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
