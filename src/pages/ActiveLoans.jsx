import React from 'react';
import { loanHistory } from '../data/dummydata.js';
import LoanCard from '../components/LoanCard.jsx';

const ActiveLoans = ({ user }) => {
  // Use the logged-in user's ID instead of hardcoded value
  const currentMemberId = user?.id || 1;
  
  // If admin, show all loan history, otherwise filter by user ID
  const myLoanHistory = user?.role === 'admin'
    ? loanHistory
    : loanHistory.filter((loan) => loan.memberId === currentMemberId);

  return (
    // Add left margin for sidebar and top padding for fixed navbar
    <div className="ml-64 md:ml-40 px-4 pt-28">
      <h2 className="text-xl font-bold mb-4 text-center">
        {user?.role === 'admin' ? 'All Loan History' : 'My Loan History'}
      </h2>

      {myLoanHistory.length === 0 ? (
        <p className="text-center text-gray-500">No past loans found.</p>
      ) : (
        <div className="space-y-4 max-w-6xl mx-auto">
          {myLoanHistory.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveLoans;

