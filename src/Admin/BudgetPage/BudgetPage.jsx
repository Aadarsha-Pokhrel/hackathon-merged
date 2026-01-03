import { loans as initialLoans } from '../LoanRequest/loans.js';
import { useState } from 'react';
import './BudgetPage.css';

export function BudgetPage() {
  const [loans] = useState(initialLoans);

  const totalBudget = 50000; // Example total budget
  const totalLoaned = loans.reduce((acc, loan) => acc + loan.amount, 0);
  const currentMoney = totalBudget - totalLoaned;

  return (
    <div className="budget-page">
      <h1 className="page-title">💰 Budget Overview</h1>

      <div className="budget-summary">
        <div className="budget-card">
          <p>Total Budget</p>
          <h2>₹ {totalBudget}</h2>
        </div>
        <div className="budget-card">
          <p>Current Money</p>
          <h2>₹ {currentMoney}</h2>
        </div>
      </div>

    </div>
  );
}
