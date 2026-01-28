import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Megaphone, Plus, Trash2, Sparkles, Clock } from "lucide-react";

export function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

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
        <span
          key={i}
          className="font-bold text-emerald-400 bg-emerald-500/10 px-1 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Megaphone className="text-indigo-400" /> Admin Notices
        </h1>
        <p className="text-slate-400 mt-1">Broadcast updates to all members</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Create Notice */}
      <Card className="p-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
        <div className="bg-slate-950/80 p-6 rounded-xl">
          <label className="text-sm font-medium text-indigo-300 mb-3 flex items-center gap-2">
            <Sparkles size={14} /> Create New Announcement
          </label>

          <textarea
            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-sm resize-none min-h-[120px]"
            placeholder="Write something exciting for the members..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-3 flex justify-end">
            <Button
              onClick={addNotice}
              isLoading={loading}
              disabled={!text.trim()}
              className="bg-indigo-600 hover:bg-indigo-500"
            >
              <Plus size={16} className="mr-2" /> Post Now
            </Button>
          </div>
        </div>
      </Card>

      {/* Notices */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card
            key={notice.notice_id}
            className="border-l-4 border-indigo-500"
          >
            <div className="flex justify-between">
              <div>
                <div className="flex gap-2 items-center mb-1">
                  <span className="text-xs text-indigo-300 uppercase font-bold">
                    {notice.type || "General"}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> {formatDateTime(notice.createdAt)}
                  </span>
                </div>
                <p className="text-slate-200">
                  {formatNoticeText(notice.purpose)}
                </p>
              </div>

              <Button variant="ghost" size="sm">
                <Trash2 size={16} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}