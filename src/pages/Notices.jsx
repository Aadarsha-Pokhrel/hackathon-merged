import { useState } from 'react';
import { notices as initialNotices } from '../data/dummydata.js';

export function Notices({ user }) {
  const [notices] = useState(
    initialNotices.map((n) => ({
      ...n,
      createdAt: new Date(n.createdAt), // Use actual date if available
    }))
  );

  // Helper function to display time ago
  function timeAgo(date) {
    const diff = (new Date() - date) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    // Sidebar safe + top padding
    <div className="ml-64 md:ml-40 px-4 pt-28 bg-green-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header with conditional add button for admin */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            📢 Notices Feed
          </h1>
          {user?.role === 'admin' && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              + Add Notice
            </button>
          )}
        </div>

        {/* Notice list */}
        <div className="space-y-5">
          {notices.length === 0 ? (
            <p className="text-center text-green-600 italic">No notices yet.</p>
          ) : (
            notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Header: avatar + meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center font-bold text-white text-lg mr-4">
                      {notice.postedBy?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold text-green-900 m-0">
                        {notice.postedBy || 'Admin'}
                      </p>
                      <p className="text-green-600 text-sm">
                        {timeAgo(notice.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Admin actions */}
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition">
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Notice title (if exists) */}
                {notice.title && (
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {notice.title}
                  </h3>
                )}

                {/* Notice content */}
                <div className="text-green-900 whitespace-pre-wrap leading-relaxed">
                  {notice.description}
                </div>

                {/* Notice metadata (priority, category) */}
                <div className="flex gap-2 mt-4">
                  {notice.priority && (
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        notice.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : notice.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {notice.priority.toUpperCase()}
                    </span>
                  )}
                  {notice.category && (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                      {notice.category}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
export default Notices;

