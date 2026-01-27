import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Calendar, DollarSign, User, Clock } from 'lucide-react';

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

        const historyData = res.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        setLoanHistory(historyData);
      } catch (err) {
        console.error("Error fetching loan history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-white">My Loan History</h2>
         <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400 border border-white/5">{loanHistory.length} Record(s)</span>
      </div>

      {loading ? (
        <div className="grid gap-4">
           {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800/50 rounded-xl animate-pulse"></div>)}
        </div>
      ) : loanHistory.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
            <p className="text-slate-500">No past loans found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {loanHistory.map((loan, index) => (
            <Card key={index} className="flex flex-col md:flex-row gap-6 hover:bg-slate-800/50 transition-colors">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{loan.purpose}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        loan.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        loan.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>{loan.status}</span>
                 </div>
                 <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Calendar size={14} /> Approved: {loan.createdAt}
                 </p>
              </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-auto bg-slate-900/40 p-4 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Principal</p>
                    <p className="text-lg font-bold text-white">NPR {loan.Amount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Borrower</p>
                    <p className="text-sm font-medium text-slate-300 mt-1 flex items-center gap-1">
                        <User size={14} /> {loan.users?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Due</p>
                    <p className="text-sm font-medium text-slate-300 mt-1 flex items-center gap-1">
                        <Clock size={14} /> 1 Month
                    </p>
                  </div>
               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Loans;