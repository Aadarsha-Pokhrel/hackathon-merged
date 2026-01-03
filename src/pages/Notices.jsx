import { useState } from "react";
import { notices as initialNotices } from "../data/dummydata.js";
import "./Notices.css";

export default function Notices({ user }) {
  const [notices] = useState(
    initialNotices.map((n) => ({
      ...n,
      createdAt: new Date(n.createdAt),
    }))
  );

  function timeAgo(date) {
    const diff = (new Date() - date) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="notices-page">
      <div className="notices-container">
        {/* Header */}
        <div className="notices-header">
          <h1> Notices</h1>

          {user?.role === "admin" && (
            <button className="add-notice-btn">+ Add Notice</button>
          )}
        </div>

        {/* Notices list */}
        <div className="notices-list">
          {notices.map((notice) => (
            <div className="notice-card" key={notice.id}>
              {/* INTERNAL PADDING */}
              <div className="notice-inner">
                {/* Header */}
                <div className="notice-top">
                  <div className="notice-user">
                    <div className="avatar">
                      {notice.postedBy?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="posted-by">
                        {notice.postedBy || "Admin"}
                      </p>
                      <p className="time">
                        {timeAgo(notice.createdAt)}
                      </p>
                    </div>
                  </div>

                  {user?.role === "admin" && (
                    <div className="admin-actions">
                      <button>Edit</button>
                      <button className="danger">Delete</button>
                    </div>
                  )}
                </div>

                {/* Title */}
                {notice.title && (
                  <h3 className="notice-title">{notice.title}</h3>
                )}

                {/* Content */}
                <p className="notice-content">{notice.description}</p>

                {/* Tags */}
                <div className="notice-tags">
                  {notice.priority && (
                    <span className={`tag ${notice.priority}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                  )}
                  {notice.category && (
                    <span className="tag category">
                      {notice.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
