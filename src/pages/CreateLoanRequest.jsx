import { useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Coins, FileText, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const CreateLoanRequest = ({ user }) => {
  const [Amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, success, error

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const headerContentVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const messageVariants = {
    initial: { opacity: 0, y: -10, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setStatus("idle");

    if (!Amount || !purpose ) {
      setMessage("Please fill all fields.");
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/loan-request", 
        {
          memberId: user.id,
          Amount,
          purpose,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Loan request submitted successfully!");
      setStatus("success");
      setAmount("");
      setPurpose("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit request. Try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-6"
    >
      <motion.div 
        variants={headerVariants}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Request a Loan
        </h2>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="p-8 border-indigo-500/20 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group">
          {/* Animated background glow */}
          <motion.div 
            className="absolute top-0 right-0 w-40 h-40 opacity-5 group-hover:opacity-10 transition-opacity"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-indigo-500 rounded-full blur-3xl"></div>
          </motion.div>

          <motion.div 
            variants={headerContentVariants}
            className="flex items-center gap-4 mb-8 relative z-10"
          >
            <motion.div 
              className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            >
              <Coins size={24} />
            </motion.div>
            <div>
              <motion.h3 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-lg font-bold text-white"
              >
                New Application
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-slate-400 text-sm"
              >
                Submit your loan details for approval.
              </motion.p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                key={status}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={`mb-6 p-4 rounded-xl border flex items-center gap-3 relative z-10 ${
                  status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 
                  'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                >
                  {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                </motion.div>
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6 relative z-10"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            <motion.div variants={formItemVariants}>
              <Input 
                label="Loan Amount (NPR)"
                icon={Coins}
                type="number"
                placeholder="e.g. 50000"
                value={Amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </motion.div>

            <motion.div variants={formItemVariants}>
              <Input 
                label="Purpose"
                icon={FileText}
                type="text"
                placeholder="e.g. Home Renovation"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </motion.div>

            <motion.div 
              variants={formItemVariants}
              className="pt-4"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                  <motion.span 
                    className="flex items-center justify-center"
                    animate={loading ? { opacity: [1, 0.5, 1] } : {}}
                    transition={loading ? { duration: 1, repeat: Infinity } : {}}
                  >
                    Submit Request <Send size={18} className="ml-2" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CreateLoanRequest;