const LoanCard = ({ loan }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 max-w-6xl mx-auto mt-30">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{loan.purpose}</h3>
          <p className="text-sm text-gray-600">Approved: {loan.approvedDate}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Active</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-600">Principal Amount</p>
          <p className="font-semibold">NPR {loan.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Interest Rate</p>
          <p className="font-semibold">{loan.interestRate}% per year</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Duration</p>
          <p className="font-semibold">{loan.duration} months</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Due Date</p>
          <p className="font-semibold">{loan.dueDate}</p>
        </div>
      </div>
      
      <div className="bg-orange-50 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Repayment Status</span>
          <span className="text-sm text-gray-600">
            {loan.repaymentType === 'monthly' ? 'Monthly Installments' : 'Lump Sum at End'}
          </span>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Paid:</span>
            <span className="font-semibold text-green-600">NPR {loan.paidAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Remaining Principal:</span>
            <span className="font-semibold text-orange-600">NPR </span>
          </div>
          <div className="flex justify-between">
            <span>Total Interest:</span>
            <span className="font-semibold">NPR </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-orange-200">
            <span className="font-semibold">
              {loan.repaymentType === 'monthly' ? 'Monthly Payment:' : 'Monthly Interest:'}
            </span>
            <span className="font-bold text-orange-600">NPR </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoanCard;

