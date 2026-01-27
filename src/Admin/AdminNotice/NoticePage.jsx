import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MessageSquare, Plus, Trash2, Calendar, User, Megaphone, Sparkles, Clock } from 'lucide-react';

export function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all notices from backend
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://localhost:8080/notice", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Make sure each notice has proper fields
        const data = response.data.map((notice) => ({
          ...notice,
          createdAt: notice.createdAt ? new Date(notice.createdAt) : new Date(),
        })).sort((a, b) => b.createdAt - a.createdAt);
        
        setNotices(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch notices");
      }
    };

    fetchNotices();
  }, []);

  // Add new notice
  const addNotice = async () => {
    if (!text.trim()) return;
    setLoading(true);

    const newNotice = {
      type: "general",
      purpose: text,
      noticeCreator: "Admin",
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/create-notice",
        newNotice,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new notice at the top of the list safely
      setNotices((prev) => [
        {
          ...response.data,
          createdAt: response.data.createdAt
            ? new Date(response.data.createdAt)
            : new Date(),
        },
        ...prev,
      ]);

      setText("");
    } catch (err) {
      console.error(err);
      setError("Failed to post notice");
    } finally {
        setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const diff = (new Date() - new Date(date)) / 1000;
    if (diff < 3600) return "Just now";
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return new Date(date).toLocaleDateString();
  }

// Helper to highlight currency in text
  const formatNoticeText = (text) => {
    if (!text) return "";
    const parts = text.split(/(₹\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi);
    return parts.map((part, i) => {
        if (part.match(/(₹\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi)) {
            return <span key={i} className="font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">{part}</span>;
        }
        return part;
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Megaphone className="text-indigo-400" /> Admin Notices
            </h1>
            <p className="text-slate-400 mt-1">Broadcast updates to all members</p>
         </div>
      </div>

      {error && (
         <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
           {error}
         </div>
      )}

      {/* Create new notice */}
      <Card className="p-1 relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <div className="bg-slate-950/80 backdrop-blur-sm p-6 rounded-xl">
            <label className="block text-sm font-medium text-indigo-300 mb-3 flex items-center gap-2">
                <Sparkles size={14} /> Create New Announcement
            </label>
            <div className="relative">
                <textarea
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all resize-none min-h-[120px] placeholder:text-slate-600"
                placeholder="Write something exciting for the members... (e.g. Due of ₹ 5000)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute right-3 bottom-3">
                    <Button onClick={addNotice} isLoading={loading} disabled={!text.trim()} className="bg-indigo-600 hover:bg-indigo-500">
                        <Plus size={16} className="mr-2" /> Post Now
                    </Button>
                </div>
            </div>
        </div>
      </Card>

      {/* Notices list */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white border-b border-white/5 pb-2">Recent Broadcasts</h3>
        
        {notices.length === 0 && (
           <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
              <p className="text-slate-500">No notices yet. Be the first to post!</p>
           </div>
        )}

        <div className="grid gap-4">
            {notices.map((notice) => (
            <Card key={notice.notice_id} className="hover:bg-slate-800/60 transition-all duration-300 group border-l-4 border-l-indigo-500">
                <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/5 shadow-inner">
                         <Megaphone size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-indigo-500/20">
                                {notice.type || "General"}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock size={12} /> {timeAgo(notice.createdAt)}
                            </span>
                        </div>
                        <p className="text-slate-200 leading-relaxed font-medium">
                            {formatNoticeText(notice.purpose)}
                        </p>
                    </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 w-8 p-0 grid place-items-center rounded-full">
                        <Trash2 size={16} />
                    </Button>
                </div>
                </div>
            </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
