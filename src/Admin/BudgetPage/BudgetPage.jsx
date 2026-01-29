import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [availableBudget, setAvailableBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const cardVariants = {
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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (percentage) => ({
      width: `${percentage}%`,
      transition: {
        duration: 1.2,
        delay: 0.8,
        ease: "easeOut"
      }
    })
  };

  const numberVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  /* ---------------- FETCH BUDGET ON PAGE LOAD ---------------- */
  useEffect(() => {
    const fetchBudgetInfo = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/admin/get-budget-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setTotalBudget(res.data.totalBudget);
        setAvailableBudget(res.data.availableBudget);
      } catch (err) {
        console.error("Failed to fetch budget info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetInfo();
  }, []);

  /* ---------------- DEPOSIT MONEY ---------------- */
  const handleDeposit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/admin/create-deposits",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // backend returns updated budget
      setTotalBudget(res.data.totalBudget);
      setAvailableBudget(res.data.availableBudget);
    } catch (err) {
      console.error("Deposit failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-white text-lg">Loading budget...</p>
        </motion.div>
      </div>
    );
  }

  const percentage =
    totalBudget === 0 ? 0 : (availableBudget / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <PiggyBank className="text-emerald-400" /> Budget Overview
        </h1>

        {/* DEPOSIT BUTTON */}
        <motion.button
          onClick={handleDeposit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle size={18} />
          Deposit Money
        </motion.button>
      </motion.div>

      <motion.div
        variants={cardContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* TOTAL BUDGET */}
        <motion.div variants={cardVariants}>
          <Card className="p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-white/5 transition-shadow">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Wallet size={120} />
            </motion.div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm uppercase mb-2 flex items-center gap-2">
                <Wallet size={14} />
                Total Budget
              </p>
              <motion.h2 
                variants={numberVariants}
                className="text-4xl font-bold text-white"
              >
                NPR {totalBudget.toLocaleString()}
              </motion.h2>
              <p className="text-xs text-slate-500 mt-2">
                Combined member deposits
              </p>
            </div>
          </Card>
        </motion.div>

        {/* AVAILABLE FUNDS */}
        <motion.div variants={cardVariants}>
          <Card className="p-6 relative overflow-hidden group hover:shadow-xl hover:shadow-white/5 transition-shadow">
            <motion.div 
              className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <TrendingUp size={120} />
            </motion.div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm uppercase mb-2 flex items-center gap-2">
                <TrendingUp size={14} />
                Available Funds
              </p>

              <motion.h2
                variants={numberVariants}
                className={`text-4xl font-bold ${
                  availableBudget < 10000 ? "text-rose-400" : "text-indigo-400"
                }`}
              >
                NPR {availableBudget.toLocaleString()}
              </motion.h2>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Budget utilization</span>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="font-semibold"
                  >
                    {Math.round(percentage)}%
                  </motion.span>
                </div>
                
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    custom={percentage}
                    variants={progressBarVariants}
                    initial="hidden"
                    animate="visible"
                    className={`h-full ${
                      availableBudget < 10000 
                        ? "bg-gradient-to-r from-rose-500 to-rose-400" 
                        : "bg-gradient-to-r from-indigo-500 to-purple-500"
                    }`}
                  />
                </div>
              </div>

              {availableBudget < 10000 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-3 flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20"
                >
                  <TrendingDown size={14} />
                  Low balance alert
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}