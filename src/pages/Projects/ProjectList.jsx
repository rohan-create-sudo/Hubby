import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, query, where, onSnapshot,
  addDoc, serverTimestamp, doc, getDocs
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Plus, FolderKanban, X, CalendarDays } from 'lucide-react';

const statusClass = (s) => {
  if (s === 'Completed') return 'badge-success';
  if (s === 'In Progress') return 'badge-info';
  if (s === 'Delayed') return 'badge-danger';
  return 'badge-warning';
};

const CreateModal = ({ onClose, onCreate }) => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'Pending' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, 'projects'), {
      ...form,
      freelancerId: currentUser.uid,
      clientId: '',
      createdAt: serverTimestamp(),
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Create New Project</span>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Project Title *</label>
              <input className="input" required placeholder="e.g. Brand Identity System"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Description</label>
              <textarea className="input" placeholder="Short project overview…"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Deadline</label>
                <input className="input" type="date"
                  value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Delayed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectList = () => {
  const { currentUser, userProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const field = userProfile?.role === 'client' ? 'clientId' : 'freelancerId';

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'projects'), where(field, '==', currentUser.uid));
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [currentUser, field]);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {showModal && <CreateModal onClose={() => setShowModal(false)} />}

      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace</p>
          </div>
          {userProfile?.role === 'freelancer' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> New Project
            </button>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><FolderKanban size={28} /></div>
            <div className="empty-state-title">No projects yet</div>
            <div className="empty-state-desc">
              {userProfile?.role === 'freelancer'
                ? 'Create your first project to get started.'
                : 'Your freelancer hasn\'t added you to a project yet.'}
            </div>
            {userProfile?.role === 'freelancer' && (
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowModal(true)}>
                <Plus size={16} /> Create Project
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid-cols-3">
          {projects.map(p => (
            <div key={p.id} className="card card-hover" style={{ padding: 0 }}>
              <div style={{ padding: '22px 22px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, background: 'var(--primary-light)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <FolderKanban size={20} />
                  </div>
                  <span className={`badge ${statusClass(p.status)}`}>{p.status}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{p.title}</h3>
                <p className="line-clamp-2" style={{ fontSize: '.8125rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  {p.description || 'No description.'}
                </p>
              </div>
              <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CalendarDays size={13} />
                  {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'No deadline'}
                </span>
                <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">Open →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
