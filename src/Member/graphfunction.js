// Updated graphfunction.js
export function buildCumulativeSeriesFromMember(data) {
  if (!data || !data.deposits || !data.loans) {
    return [];
  }

  const events = [];

  // Add deposits with timestamps
  data.deposits.forEach(d => {
    events.push({
      date: new Date(d.createdAt),
      type: 'deposit',
      depositAmount: d.amount,
      loanAmount: 0,
      description: `Deposit: NPR ${d.amount}`
    });
  });

  // Add loans with timestamps
  data.loans.forEach(l => {
    events.push({
      date: new Date(l.startDate),
      type: 'loan',
      depositAmount: 0,
      loanAmount: l.principal,
      description: `Loan: NPR ${l.principal}`
    });
  });

  // Sort by date ascending
  events.sort((a, b) => a.date - b.date);

  // Build cumulative data
  let cumulativeDeposit = 0;
  let cumulativeLoan = 0;

  const series = events.map((e, index) => {
    cumulativeDeposit += e.depositAmount;
    cumulativeLoan += e.loanAmount;

    return {
      date: e.date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      depositAmount: e.depositAmount,
      loanAmount: e.loanAmount,
      cumulativeDeposit,
      cumulativeLoan,
      balance: cumulativeDeposit - cumulativeLoan,
      type: e.type,
      description: e.description,
      rawDate: e.date
    };
  });

  // If no data, return empty state
  if (series.length === 0) {
    return [{
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      }),
      depositAmount: 0,
      loanAmount: 0,
      cumulativeDeposit: 0,
      cumulativeLoan: 0,
      balance: 0
    }];
  }

  return series;
}