import { useState, useEffect } from "react";
import axios from "axios";
import "./Notices.css";

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

        console.log(res.data);

        setNotices(res.data); // use backend dates as-is
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load notices");
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) return <p>Loading notices...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div  className="notices-page">
      <div className="notices-container">
        {/* Header */}
        <div className="notices-header">
          <h1>Notices</h1>
          {user?.role === "admin" && (
            <button className="add-notice-btn">+ Add Notice</button>
          )}
        </div>

        {/* Notices list */}
        <div className="notices-list">
          {notices.map((notice) => (
            <div key={notice.notice_id} className="notice-card">
              <div className="notice-inner">
                <div className="notice-top">
                  <div className="notice-user">
                    <div className="avatar">
                      {notice.noticeCreator?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="posted-by">{notice.noticeCreator || "Admin"}</p>
                      <p className="time">{notice.createdAt}</p>
                    </div>
                  </div>

                  {user?.role === "admin" && (
                    <div className="admin-actions">
                      <button>Edit</button>
                      <button className="danger">Delete</button>
                    </div>
                  )}
                </div>

                {notice.title && <h3 className="notice-title">{notice.title}</h3>}
                <p className="notice-content">{notice.purpose}</p>

                <div className="notice-tags">
                  {notice.priority && (
                    <span className={`tag ${notice.priority}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                  )}
                  {notice.category && <span className="tag category">{notice.category}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
