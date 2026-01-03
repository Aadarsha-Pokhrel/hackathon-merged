import { useState,useEffect} from 'react'
import axios from 'axios'
import './NoticePage.css'

export  function NoticePage() {

  const [notices, setNotices] = useState([])

  // Fetch notices from backend (mock or real)
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get('http://localhost:8080/notice/1');
        setNotices(response.data)
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotice();
  }, [notices]); 


  
  const [text, setText] = useState('')

  async function addNotice() {
    if (!text.trim()) return

    const newNotice = {
      "type":"general",
      "purpose": text,
    }

    await axios.post('http://localhost:8080/create-notice',newNotice);


    setText('')
  }


  return (
    <div className="notice-page">
      <h1 className="page-title">📢 Notices Feed</h1>

      {/* Create new notice */}
      <div className="make-notice">
        <textarea
          placeholder="Write something new..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addNotice}>Post</button>
      </div>

      {/* Notice list */}
      <div className="notice-list">
        {notices.length === 0 && (
          <p className="no-notices">No notices yet. Be the first to post!</p>
        )}

        {notices.map((notice) => (
          <div key={notice.id} className="notice-card">
            <div className="notice-header">
              <div className="notice-avatar">
                {notice.purpose.charAt(0).toUpperCase()}
              </div>
              <div className="notice-meta">
                <p className="notice-author">Admin</p>
              </div>
            </div>

            <div className="notice-content">{notice.purpose}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
