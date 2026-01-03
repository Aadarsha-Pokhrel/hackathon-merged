import React from 'react';
import { loanHistory } from '../data/dummydata.js';
import LoanCard from '../components/LoanCard.jsx';
import './ActiveLoans.css';

const ActiveLoans = ({ user }) => {
  const currentMemberId = user?.id || 1;

  const myLoanHistory =
    user?.role === 'admin'
      ? loanHistory
      : loanHistory.filter((loan) => loan.memberId === currentMemberId);

  return (
    <div className="active-loans-container">
      <h2 className="active-loans-title">
        {user?.role === 'admin' ? 'All Loan History' : 'My Loan History'}
      </h2>

      {myLoanHistory.length === 0 ? (
        <p className="no-loans-text">No past loans found.</p>
      ) : (
        <div className="loan-cards-wrapper">
          {myLoanHistory.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveLoans;
