import { loans as initialLoans } from '../LoanRequest/loans.js';
import { useState } from 'react';
import { Card } from "../../components/ui/Card";
import { Wallet, TrendingDown, PiggyBank } from 'lucide-react';

export function BudgetPage() {
  const [loans] = useState(initialLoans);

  const totalBudget = 50000; // Example total budget
  const totalLoaned = loans.reduce((acc, loan) => acc + loan.amount, 0);
  const currentMoney = totalBudget - totalLoaned;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
         <PiggyBank className="text-emerald-400" /> Budget Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet size={120} />
            </div>
            <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Budget</p>
                <h2 className="text-4xl font-bold text-white tracking-tight">₹ {totalBudget.toLocaleString()}</h2>
                
                <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 w-fit px-2 py-1 rounded-full border border-emerald-500/20">
                     Fixed Allocation
                </div>
            </div>
        </Card>

        <Card className="p-6 relative overflow-hidden group border-indigo-500/20 shadow-indigo-500/10">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingDown size={120} />
            </div>
            <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Available Funds</p>
                <h2 className={`text-4xl font-bold tracking-tight ${currentMoney < 10000 ? 'text-rose-400' : 'text-indigo-400'}`}>
                    ₹ {currentMoney.toLocaleString()}
                </h2>
                
                <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
                     <div className="h-2 w-full max-w-[150px] bg-slate-800 rounded-full overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${currentMoney < 10000 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                           style={{ width: `${(currentMoney/totalBudget)*100}%` }}
                        ></div>
                     </div>
                     {Math.round((currentMoney/totalBudget)*100)}% Remaining
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}
