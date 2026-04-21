import React, { useEffect, useState, useRef } from 'react';
import {
  collection, query, where, onSnapshot,
  addDoc, serverTimestamp, orderBy
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Send, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { currentUser, userProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [loading, setLoading] = useState(true);
  const msgEndRef = useRef(null);

  const field = userProfile?.role === 'client' ? 'clientId' : 'freelancerId';

  // Load projects (conversations)
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'projects'), where(field, '==', currentUser.uid));
    return onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(list);
      if (list.length > 0 && !activeProject) setActiveProject(list[0]);
      setLoading(false);
    });
  }, [currentUser, field]);

  // Real-time messages for active project
  useEffect(() => {
    if (!activeProject) return;
    const q = query(
      collection(db, 'messages'),
      where('projectId', '==', activeProject.id),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    });
  }, [activeProject]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!msgText.trim() || !activeProject) return;
    await addDoc(collection(db, 'messages'), {
      projectId: activeProject.id,
      senderId: currentUser.uid,
      senderName: userProfile?.name || 'User',
      text: msgText.trim(),
      createdAt: serverTimestamp(),
    });
    setMsgText('');
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  if (projects.length === 0) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Messages</h1>
          <p className="page-subtitle">Project-based conversations</p>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><MessageSquare size={28} /></div>
            <div className="empty-state-title">No conversations yet</div>
            <div className="empty-state-desc">Messages are linked to projects. Create or join a project first.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div className="page-header" style={{ marginBottom: 16 }}>
        <h1 className="page-title">Messages</h1>
        <p className="page-subtitle">Project-based real-time conversations</p>
      </div>

      <div className="chat-shell" style={{ flex: 1 }}>
        {/* Sidebar - Project List */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <input className="input" placeholder="Search projects…" style={{ background: 'var(--bg)' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {projects.map(p => (
              <div
                key={p.id}
                className={`chat-contact${activeProject?.id === p.id ? ' active' : ''}`}
                onClick={() => setActiveProject(p)}
              >
                <div className="chat-contact-avatar">
                  {p.title?.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="chat-contact-name">{p.title}</div>
                  <div className="chat-contact-preview">{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {/* Chat Header */}
          <div className="chat-main-header">
            <div className="chat-contact-avatar" style={{ width: 36, height: 36, fontSize: '.75rem' }}>
              {activeProject?.title?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.9375rem' }}>{activeProject?.title}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>Project chat</div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.875rem', margin: 'auto' }}>
                No messages yet. Say hello! 👋
              </div>
            )}
            {messages.map(msg => {
              const mine = msg.senderId === currentUser.uid;
              return (
                <div key={msg.id} className={`chat-msg ${mine ? 'mine' : 'theirs'}`}>
                  {!mine && (
                    <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>
                      {msg.senderName}
                    </div>
                  )}
                  <div className="chat-bubble">{msg.text}</div>
                  <div className="chat-time">
                    {msg.createdAt?.toDate
                      ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </div>
                </div>
              );
            })}
            <div ref={msgEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMsg} className="chat-input-wrap">
            <input
              className="chat-input"
              placeholder="Type a message…"
              value={msgText}
              onChange={e => setMsgText(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
