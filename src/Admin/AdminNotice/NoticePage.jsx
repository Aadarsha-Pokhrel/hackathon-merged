import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Megaphone, Plus, Trash2, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const createCardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2
      }
    }
  };

  const noticesContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const errorVariants = {
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

  const iconVariants = {
    hover: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    }
  };

  // 🔹 Fetch notices
  const fetchNotices = async () => {
    try {
      setError("");
      const response = await axios.get("http://localhost:8080/notice", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      const sorted = data.sort((a, b) => {
        const diff = new Date(b.createdAt) - new Date(a.createdAt);
        return diff !== 0 ? diff : b.notice_id - a.notice_id;
      });

      setNotices(sorted);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // 🔹 Add notice (FIXED)
  const addNotice = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    const payload = {
      type: "general",
      purpose: text,
      noticeCreator: "Admin",
    };

    try {
      await axios.post(
        "http://localhost:8080/create-notice",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setText("");

      // ✅ RE-FETCH FROM BACKEND (FIX)
      await fetchNotices();
    } catch (err) {
      console.error(err);
      setError("Failed to post notice");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Format datetime
  const formatDateTime = (date) => {
    if (!date) return "Just now";
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // 🔹 Highlight currency
  const formatNoticeText = (text) => {
    if (!text) return "";
    const parts = text.split(/(₹\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi);
    return parts.map((part, i) =>
      part.match(/(₹\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi) ? (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded"
        >
          {part}
        </motion.span>
      ) : (
        part
      )
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <motion.div variants={headerVariants}>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
          <motion.div
            whileHover="hover"
            variants={iconVariants}
          >
            <Megaphone className="text-indigo-400" />
          </motion.div>
          Admin Notices
        </h1>
        <p className="text-slate-400 mt-1">Broadcast updates to all members</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            variants={errorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Notice */}
      <motion.div variants={createCardVariants}>
        <Card className="p-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 relative overflow-hidden group">
          {/* Animated background glow */}
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-10 transition-opacity"
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

          <div className="bg-slate-950/80 p-6 rounded-xl relative z-10">
            <motion.label
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-indigo-300 mb-3 flex items-center gap-2"
            >
              <Sparkles size={14} /> Create New Announcement
            </motion.label>

            <motion.textarea
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileFocus={{ scale: 1.01, transition: { duration: 0.2 } }}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm resize-none min-h-[120px] focus:border-indigo-500/50 transition-colors"
              placeholder="Write something exciting for the members..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 flex justify-end"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={addNotice}
                  isLoading={loading}
                  disabled={!text.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500"
                >
                  <Plus size={16} className="mr-2" /> Post Now
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Notices */}
      <motion.div
        variants={noticesContainerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {notices.map((notice) => (
            <motion.div
              key={notice.notice_id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              layout
              whileHover={{
                x: 4,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="border-l-4 border-indigo-500 relative overflow-hidden group">
                {/* Hover glow effect */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 transition-opacity"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -90, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-full h-full bg-indigo-500 rounded-full blur-2xl"></div>
                </motion.div>

                <div className="flex justify-between relative z-10">
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex gap-2 items-center mb-1"
                    >
                      <span className="text-xs text-indigo-300 uppercase font-bold">
                        {notice.type || "General"}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {formatDateTime(notice.createdAt)}
                      </span>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-slate-200"
                    >
                      {formatNoticeText(notice.purpose)}
                    </motion.p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="sm">
                      <Trash2 size={16} />
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}