import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Bell, Clock, Megaphone, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Notices({ user }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const featuredVariants = {
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
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2
      }
    }
  };

  const timelineContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.4
      }
    }
  };

  const timelineItemVariants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const emptyStateVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:8080/notice", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure createdAt exists and sort newest first
        const enrichedData = res.data
          .map(n => ({
            ...n,
            createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString()
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first

        setNotices(enrichedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load notices");
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const timeAgo = (date) => {
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 3600) return "Just now";
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  // Highlight currency in text
  const formatNoticeText = (text) => {
    if (!text) return "";
    const parts = text.split(/(NPR\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi);
    return parts.map((part, i) =>
      /(NPR\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi.test(part) ? (
        <span key={i} className="font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">{part}</span>
      ) : part
    );
  };

  const featuredNotice = notices[0];
  const otherNotices = notices.slice(1);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div 
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 flex items-center gap-2">
            <Megaphone className="text-indigo-400" /> Announcements
          </h1>
          <p className="text-slate-400 mt-1">Stay updated with the latest news</p>
        </div>
        {user?.role === "admin" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 shadow-lg">
              + Add Notice
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500">Fetching updates...</p>
          </motion.div>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center"
        >
          {error}
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Featured Hero Notice */}
          {featuredNotice && (
            <motion.div 
              variants={featuredVariants}
              initial="hidden"
              animate="visible"
              className="relative group"
            >
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              ></motion.div>
              <Card className="relative bg-slate-900 border-indigo-500/20 p-8 overflow-hidden">
                <motion.div 
                  className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none"
                  animate={{
                    rotate: [12, 18, 12],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Megaphone size={180} />
                </motion.div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.span 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Sparkles size={12} />
                      </motion.div>
                      New
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="text-slate-400 text-sm flex items-center gap-1.5"
                    >
                      <Clock size={14} /> {timeAgo(featuredNotice.createdAt)}
                    </motion.span>
                  </div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-2xl font-bold text-white mb-4 leading-tight"
                  >
                    {featuredNotice.title || "Important Announcement"}
                  </motion.h2>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-slate-300 text-lg leading-relaxed max-w-3xl"
                  >
                    {formatNoticeText(featuredNotice.purpose)}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="mt-6 flex items-center gap-3 pt-6 border-t border-white/5"
                  >
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-slate-900 font-bold text-xs"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {featuredNotice.noticeCreator?.charAt(0).toUpperCase() || "A"}
                    </motion.div>
                    <span className="text-sm text-slate-400">
                      Posted by <span className="text-white font-medium">{featuredNotice.noticeCreator || "Admin"}</span>
                    </span>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Timeline List for Other Notices */}
          {otherNotices.length > 0 && (
            <motion.div 
              variants={timelineContainerVariants}
              initial="hidden"
              animate="visible"
              className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-8 py-4"
            >
              {otherNotices.map((notice, idx) => (
                <motion.div 
                  key={notice.notice_id || idx} 
                  variants={timelineItemVariants}
                  className="relative pl-8 md:pl-12 group"
                >
                  {/* Timeline Dot */}
                  <motion.div 
                    className="absolute -left-[5px] top-6 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors shadow-[0_0_0_4px_rgba(30,41,59,1)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.5 + idx * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ scale: 1.3 }}
                  ></motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="p-5 hover:bg-slate-800/80 transition-all duration-300 border-white/5 group-hover:border-indigo-500/20">
                      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-3">
                        <div className="flex items-center gap-2">
                          <motion.span 
                            className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 text-xs font-medium border border-white/5 uppercase"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                          >
                            {notice.type || "General"}
                          </motion.span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar size={12} /> {new Date(notice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-300 leading-relaxed text-sm">
                        {formatNoticeText(notice.purpose)}
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No notices */}
          {notices.length === 0 && (
            <motion.div 
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10"
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Bell size={48} className="mx-auto text-slate-600 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">No notices yet</h3>
              <p className="text-slate-500 mt-2">Check back later for announcements.</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}