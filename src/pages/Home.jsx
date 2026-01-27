import { Card } from '../components/ui/Card';
import LoanCard from '../components/LoanCard'; 
import { Wallet, CreditCard, PiggyBank, PlusCircle, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 2000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
];

const Home = ({ user }) => {  
    return (
      <div className="space-y-8">
          <div className="text-center md:text-left">
             <h2 className="text-3xl font-bold text-white">
                Welcome, {user?.name || "User"}!
             </h2>
             <p className="text-slate-400 mt-1">Here is your financial overview.</p>
          </div>

          {/* Hero Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hoverEffect className="relative overflow-hidden">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <PiggyBank size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Total Deposits</p>
                        <p className="text-2xl font-bold text-white">NPR 120,000</p>
                    </div>
                </div>
            </Card>

            <Card hoverEffect className="relative overflow-hidden">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Active Loans</p>
                        <p className="text-2xl font-bold text-white">1</p>
                    </div>
                </div>
            </Card>

            <Card hoverEffect className="relative overflow-hidden">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Total Borrowed</p>
                        <p className="text-2xl font-bold text-white">NPR 40,000</p>
                    </div>
                </div>
            </Card>
          </div>

          {/* Activity Chart */}
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
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/member/createrequest" className="block">
                    <Card hoverEffect className="h-full flex flex-col items-center justify-center p-6 text-center border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-500/5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 flex items-center justify-center text-indigo-400 transition-colors mb-4">
                            <PlusCircle size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Apply for Loan</h3>
                        <p className="text-sm text-slate-400 mt-1">Request a new loan easily</p>
                    </Card>
                </Link>

                <Link to="/member/notices" className="block">
                    <Card hoverEffect className="h-full flex flex-col items-center justify-center p-6 text-center border-dashed border-white/10 hover:border-white/20 bg-white/5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-amber-400 transition-colors mb-4">
                            <Bell size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white">View Notices</h3>
                        <p className="text-sm text-slate-400 mt-1">Check latest announcements</p>
                    </Card>
                </Link>

                <Link to="/member/contacts" className="block">
                    <Card hoverEffect className="h-full flex flex-col items-center justify-center p-6 text-center border-dashed border-white/10 hover:border-white/20 bg-white/5 cursor-pointer group">
                        <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-emerald-400 transition-colors mb-4">
                            <User size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Members Contact</h3>
                        <p className="text-sm text-slate-400 mt-1">Find other members</p>
                    </Card>
                </Link>
            </div>
          </div>

          {/* Active Loans Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">My Active Loans</h2>
            
            {user.loansTaken === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-slate-500">No active loans found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <LoanCard key={user.userId} user={user} />
                </div>
            )}
          </div>
      </div>
    )
}

export default Home

