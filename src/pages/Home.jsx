import { Card } from '../components/ui/Card';
import LoanCard from '../components/LoanCard'; 
import { Wallet, CreditCard, PiggyBank } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import MemberFinanceChart from './MemberFinanceChart';
import { motion } from "framer-motion";

const Home = () => {
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const statCardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const chartVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.6
      }
    }
  };

  const loansVariants = {
    hidden: { 
      opacity: 0, 
      y: 40 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.8
      }
    }
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMemberData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-red-400 text-center py-12"
      >
        No dashboard data available
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Welcome, {memberData?.name || "User"}!
          </h2>
          <p className="text-slate-400 mt-1">Here is your financial overview.</p>
        </div>
      </motion.div>

      {/* Hero Cards */}
      <motion.div 
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Deposits */}
        <motion.div variants={statCardVariants}>
          <Card hoverEffect className="relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full blur-2xl"></div>
            </motion.div>
            <div className="relative z-10 flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PiggyBank size={24} />
              </motion.div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Deposits</p>
                <motion.p 
                  variants={numberVariants}
                  className="text-2xl font-bold text-white"
                >
                  {`NPR ${memberData.totalDeposit || 0}`}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Loans */}
        <motion.div variants={statCardVariants}>
          <Card hoverEffect className="relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -90, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <div className="w-20 h-20 bg-indigo-500 rounded-full blur-2xl"></div>
            </motion.div>
            <div className="relative z-10 flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CreditCard size={24} />
              </motion.div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Loans</p>
                <motion.p 
                  variants={numberVariants}
                  className="text-2xl font-bold text-white"
                >
                  {memberData.loansTaken || 0}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Total Borrowed */}
        <motion.div variants={statCardVariants}>
          <Card hoverEffect className="relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <div className="w-20 h-20 bg-rose-500 rounded-full blur-2xl"></div>
            </motion.div>
            <div className="relative z-10 flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Wallet size={24} />
              </motion.div>
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Borrowed</p>
                <motion.p 
                  variants={numberVariants}
                  className="text-2xl font-bold text-white"
                >
                  {`NPR ${memberData.totalBorrowed || 0}`}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Financial Activity Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            Financial Activity
          </h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <MemberFinanceChart memberData={memberData} />
          </motion.div>
        </Card>
      </motion.div>

      {/* Active Loans */}
      <motion.div 
        variants={loansVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          My Active Loans
        </h2>

        {memberData.loansTaken === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10"
          >
            <p className="text-slate-500">No active loans found.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LoanCard user={memberData} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;