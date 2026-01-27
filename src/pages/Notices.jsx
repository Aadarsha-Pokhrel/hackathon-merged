import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Bell, Clock, Megaphone, Calendar, Sparkles } from "lucide-react";

export default function Notices({ user }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    const parts = text.split(/(₹\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi);
    return parts.map((part, i) =>
      /(₹\s*[\d,]+|NPR\s*[\d,]+|Rs\.?\s*[\d,]+)/gi.test(part) ? (
        <span key={i} className="font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded">{part}</span>
      ) : part
    );
  };

  const featuredNotice = notices[0];
  const otherNotices = notices.slice(1);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Megaphone className="text-indigo-400" /> Announcements
          </h1>
          <p className="text-slate-400 mt-1">Stay updated with the latest news</p>
        </div>
        {user?.role === "admin" && (
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20 shadow-lg">
            + Add Notice
          </Button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Fetching updates...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center">
          {error}
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in">

          {/* Featured Hero Notice */}
          {featuredNotice && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <Card className="relative bg-slate-900 border-indigo-500/20 p-8 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 pointer-events-none">
                  <Megaphone size={180} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} /> New
                    </span>
                    <span className="text-slate-400 text-sm flex items-center gap-1.5">
                      <Clock size={14} /> {timeAgo(featuredNotice.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {featuredNotice.title || "Important Announcement"}
                  </h2>

                  <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                    {formatNoticeText(featuredNotice.purpose)}
                  </p>

                  <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-slate-900 font-bold text-xs">
                      {featuredNotice.noticeCreator?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <span className="text-sm text-slate-400">
                      Posted by <span className="text-white font-medium">{featuredNotice.noticeCreator || "Admin"}</span>
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Timeline List for Other Notices */}
          {otherNotices.length > 0 && (
            <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-8 py-4">
              {otherNotices.map((notice, idx) => (
                <div key={notice.notice_id || idx} className="relative pl-8 md:pl-12 group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[5px] top-6 w-3 h-3 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors shadow-[0_0_0_4px_rgba(30,41,59,1)]"></div>

                  <Card className="p-5 hover:bg-slate-800/80 transition-all duration-300 group-hover:translate-x-1 border-white/5 group-hover:border-indigo-500/20">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 text-xs font-medium border border-white/5 uppercase">
                          {notice.type || "General"}
                        </span>
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
                </div>
              ))}
            </div>
          )}

          {/* No notices */}
          {notices.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Bell size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-white">No notices yet</h3>
              <p className="text-slate-500 mt-2">Check back later for announcements.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}