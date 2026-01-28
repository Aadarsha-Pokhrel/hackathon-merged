import { Card } from '../components/ui/Card';
import LoanCard from '../components/LoanCard'; 
import { Wallet, CreditCard, PiggyBank } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useState, useEffect } from 'react';

const dummyChartData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
];

const Home = ({ user }) => {

  const [depositData, setDepositData] = useState({
    totalDeposit: 0,
    totalBurrowed: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("token"); // ✅ get fresh token

    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8080/deposits", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDepositData(res.data);
    } catch (err) {
      console.error("Failed to fetch deposit data", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ runs once AND whenever user changes (login)
  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-white">
          Welcome, {user?.name || "User"}!
        </h2>
        <p className="text-slate-400 mt-1">Here is your financial overview.</p>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Deposits */}
        <Card hoverEffect>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <PiggyBank size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Deposits</p>
              <p className="text-2xl font-bold text-white">
                {loading ? "—" : `NPR ${depositData.totalDeposit}`}
              </p>
            </div>
          </div>
        </Card>

        {/* Active Loans */}
        <Card hoverEffect>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Loans</p>
              <p className="text-2xl font-bold text-white">
                {user?.loansTaken || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Total Borrowed */}
        <Card hoverEffect>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Borrowed</p>
              <p className="text-2xl font-bold text-white">
                {loading ? "—" : `NPR ${depositData.totalBurrowed}`}
              </p>
            </div>
          </div>
        </Card>

      </div>

      {/* Activity Chart (UNCHANGED) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Financial Activity</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyChartData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Active Loans */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">My Active Loans</h2>

        {user?.loansTaken === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
            <p className="text-slate-500">No active loans found.</p>
          </div>
        ) : (
          <LoanCard key={user.userId} user={user} />
        )}
      </div>

    </div>
  );
};

export default Home;