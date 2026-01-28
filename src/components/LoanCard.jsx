import { Card } from "./ui/Card";
import { Calendar } from "lucide-react";

const LoanCard = ({ user }) => {

  // ✅ calculate due date = startdate + 1 month
  const startDate = user.startdate ? new Date(user.startdate) : null;

  let dueDate = "—";
  if (startDate) {
    const tempDate = new Date(startDate);
    tempDate.setMonth(tempDate.getMonth() + 1);
    dueDate = tempDate.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  return (
    <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-500/30 transition-colors">

      {/* Header Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">
            {user.loanPurpose || "Personal Loan"}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        <p className="text-sm text-slate-400 flex items-center gap-2">
          <Calendar size={14} />
          Approved:
          <span className="text-slate-300">
            {user.startdate}
          </span>
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 bg-slate-900/40 p-4 rounded-xl border border-white/5 w-full md:w-auto">

        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Principal
          </p>
          <p className="text-lg font-bold text-white">
            NPR {user.principal?.toLocaleString()}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Interest
          </p>
          <p className="text-lg font-bold text-white">
            {user.interestRate}% <span className="text-xs text-slate-500">/ yr</span>
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Duration
          </p>
          <p className="text-lg font-bold text-white">
            {user.durationMonths} m
          </p>
        </div>

        {/* ✅ UPDATED DUE DATE */}
        <div className="space-y-1">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Due
          </p>
          <p className="text-sm font-medium text-slate-300 mt-1">
            {dueDate}
          </p>
        </div>

      </div>
    </Card>
  );
};

export default LoanCard;