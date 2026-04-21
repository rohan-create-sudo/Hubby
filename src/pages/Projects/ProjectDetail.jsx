import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  doc, getDoc, collection, query, where,
  onSnapshot, addDoc, updateDoc, serverTimestamp, orderBy
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, CheckCircle2, Plus, X,
  Send, FileText, CalendarDays, User
} from 'lucide-react';

const statusClass = (s) => {
  if (s === 'Completed') return 'badge-success';
  if (s === 'In Progress') return 'badge-info';
  if (s === 'Delayed') return 'badge-danger';
  return 'badge-warning';
};

const taskBadge = (s) => {
  if (s === 'Done') return 'badge-success';
  if (s === 'Doing') return 'badge-info';
  return 'badge-neutral';
};

const AddTaskModal = ({ projectId, onClose }) => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', status: 'To Do', deadline: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, 'tasks'), {
      ...form,
      projectId,
      assignedTo: currentUser.uid,
      createdAt: serverTimestamp(),
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Add Task</span>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Title *</label>
              <input className="input" required placeholder="Task title"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="input" placeholder="What needs to be done?"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>To Do</option><option>Doing</option><option>Done</option>
                </select>
              </div>
              <div>
                <label className="form-label">Deadline</label>
                <input className="input" type="date"
                  value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding…' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { currentUser, userProfile } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const msgEndRef = useRef(null);

  // Load project
  useEffect(() => {
    getDoc(doc(db, 'projects', id)).then(snap => {
      if (snap.exists()) setProject({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
  }, [id]);

  // Real-time tasks
  useEffect(() => {
    const q = query(collection(db, 'tasks'), where('projectId', '==', id));
    return onSnapshot(q, snap => setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [id]);

  // Real-time messages
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('projectId', '==', id),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    });
  }, [id]);

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    await addDoc(collection(db, 'messages'), {
      projectId: id,
      senderId: currentUser.uid,
      senderName: userProfile?.name || 'User',
      text: msgText.trim(),
      createdAt: serverTimestamp(),
    });
    setMsgText('');
  };

  const toggleTaskStatus = async (task) => {
    const next = task.status === 'To Do' ? 'Doing' : task.status === 'Doing' ? 'Done' : 'To Do';
    await updateDoc(doc(db, 'tasks', task.id), { status: next });
  };

  const updateProjectStatus = async (status) => {
    await updateDoc(doc(db, 'projects', id), { status });
    setProject(p => ({ ...p, status }));
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!project) return <div className="empty-state"><div className="empty-state-title">Project not found.</div></div>;

  return (
    <div>
      {showTaskModal && <AddTaskModal projectId={id} onClose={() => setShowTaskModal(false)} />}

      <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '.8125rem', color: 'var(--text-muted)', marginBottom: 18 }}>
        <ArrowLeft size={15} /> Back to Projects
      </Link>

      <div className="page-header">
        <div className="page-header-row" style={{ flexWrap: 'wrap' }}>
          <div>
            <h1 className="page-title">{project.title}</h1>
            <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap', fontSize: '.8125rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><CalendarDays size={14} /> {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
              <span className={`badge ${statusClass(project.status)}`}>{project.status}</span>
            </div>
          </div>
          {userProfile?.role === 'freelancer' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <select className="input" style={{ width: 'auto' }} value={project.status}
                onChange={e => updateProjectStatus(e.target.value)}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Delayed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid-main-aside">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Description */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={17} /> Description</span>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {project.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Tasks */}
          <div className="card">
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={17} /> Tasks ({tasks.length})</span>
              {userProfile?.role === 'freelancer' && (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowTaskModal(true)}>
                  <Plus size={14} /> Add Task
                </button>
              )}
            </div>
            {tasks.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 24px' }}>
                <div className="empty-state-title">No tasks yet</div>
                <div className="empty-state-desc">Add tasks to track work on this project.</div>
              </div>
            ) : (
              <div>
                {tasks.map(task => (
                  <div key={task.id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="checkbox" checked={task.status === 'Done'} onChange={() => toggleTaskStatus(task)}
                      style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '.875rem', textDecoration: task.status === 'Done' ? 'line-through' : 'none', color: task.status === 'Done' ? 'var(--text-muted)' : 'var(--text)' }}>
                        {task.title}
                      </div>
                      {task.description && <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{task.description}</div>}
                    </div>
                    <span className={`badge ${taskBadge(task.status)}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Chat */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '560px', padding: 0, overflow: 'hidden' }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Send size={16} /> Project Chat</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.8125rem', marginTop: 'auto', paddingTop: 40 }}>
                No messages yet. Start the conversation!
              </div>
            )}
            {messages.map(msg => {
              const mine = msg.senderId === currentUser.uid;
              return (
                <div key={msg.id} className={`chat-msg ${mine ? 'mine' : 'theirs'}`}>
                  {!mine && <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 3 }}>{msg.senderName}</div>}
                  <div className="chat-bubble">{msg.text}</div>
                  <div className="chat-time">
                    {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              );
            })}
            <div ref={msgEndRef} />
          </div>
          <form onSubmit={sendMsg} style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, background: 'var(--bg-card)' }}>
            <input className="chat-input" placeholder="Type a message…" value={msgText} onChange={e => setMsgText(e.target.value)} />
            <button type="submit" className="chat-send-btn"><Send size={16} /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
