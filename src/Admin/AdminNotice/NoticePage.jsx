import { useState, useEffect } from "react";
import axios from "axios";
import "./NoticePage.css";

export function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

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
        }));

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
    }
  };

  return (
    <div className="notice-page">
      <h1 className="page-title">Admin Notices</h1>

      {error && <p className="error">{error}</p>}

      {/* Create new notice */}
      <div className="make-notice">
        <textarea
          placeholder="Write something new..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addNotice}>Post</button>
      </div>

      {/* Notices list */}
      <div className="notice-list">
        {notices.length === 0 && (
          <p className="no-notices">No notices yet. Be the first to post!</p>
        )}

        {notices.map((notice) => (
          <div key={notice.notice_id} className="notice-card">
            <div className="notice-header">
              <div className="notice-avatar">
                {notice.noticeCreator?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="notice-meta">
                <p className="notice-author">
                  {notice.noticeCreator || "Admin"}
                </p>
                <p className="notice-date">
                  {notice.createdAt
                    ? notice.createdAt.toLocaleString()
                    : ""}
                </p>
              </div>
            </div>

            <div className="notice-content">{notice.purpose}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
