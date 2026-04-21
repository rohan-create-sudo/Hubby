import React, { useEffect, useState } from 'react';
import {
  collection, query, where, onSnapshot,
  addDoc, updateDoc, doc, serverTimestamp, getDocs
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Plus, X, CheckSquare } from 'lucide-react';

const COLUMNS = [
  { id: 'To Do',  label: 'To Do',       dot: '#94a3b8', count_bg: '#f1f5f9' },
  { id: 'Doing',  label: 'In Progress', dot: '#3b82f6', count_bg: '#eff6ff' },
  { id: 'Done',   label: 'Completed',   dot: '#10b981', count_bg: '#ecfdf5' },
];

const AddTaskModal = ({ projects, onClose }) => {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', status: 'To Do', deadline: '', projectId: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addDoc(collection(db, 'tasks'), {
      ...form,
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
          <span className="modal-title">Add New Task</span>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Task Title *</label>
              <input className="input" required placeholder="What needs to be done?"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="input" placeholder="Additional details…"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Project</label>
                <select className="input" value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}>
                  <option value="">— Select Project —</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Status</label>
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option>To Do</option><option>Doing</option><option>Done</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label">Deadline</label>
              <input className="input" type="date"
                value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
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

const TaskManager = () => {
  const { currentUser, userProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const field = userProfile?.role === 'client' ? 'clientId' : 'freelancerId';

  useEffect(() => {
    if (!currentUser) return;
    // Load user's projects
    const pq = query(collection(db, 'projects'), where(field, '==', currentUser.uid));
    const unsub = onSnapshot(pq, snap => {
      const projs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(projs);
      if (projs.length === 0) { setTasks([]); setLoading(false); return; }
      const ids = projs.map(p => p.id);
      // Load tasks for those projects
      const tq = query(collection(db, 'tasks'), where('projectId', 'in', ids));
      onSnapshot(tq, tsnap => {
        setTasks(tsnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      });
    });
    return unsub;
  }, [currentUser, field]);

  const moveTask = async (taskId, newStatus) => {
    await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {showModal && <AddTaskModal projects={projects} onClose={() => setShowModal(false)} />}

      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Task Board</h1>
            <p className="page-subtitle">Manage all tasks across your projects</p>
          </div>
          {userProfile?.role === 'freelancer' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Add Task
            </button>
          )}
        </div>
      </div>

      {tasks.length === 0 && projects.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><CheckSquare size={28} /></div>
            <div className="empty-state-title">No tasks yet</div>
            <div className="empty-state-desc">Create a project first, then add tasks to it.</div>
          </div>
        </div>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="kanban-column">
                <div className="kanban-col-header">
                  <span className="kanban-col-title">
                    <span className="k-dot" style={{ background: col.dot }} />
                    {col.label}
                  </span>
                  <span className="kanban-col-count" style={{ background: col.count_bg }}>
                    {colTasks.length}
                  </span>
                </div>
                <div className="kanban-col-body">
                  {colTasks.map(task => (
                    <div key={task.id} className="kanban-card">
                      <div className="kanban-card-title">{task.title}</div>
                      {task.description && <div className="kanban-card-desc">{task.description}</div>}
                      {task.deadline && (
                        <div style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginTop: 8 }}>
                          Due {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      )}
                      <div className="kanban-card-footer">
                        {col.id !== 'To Do' && (
                          <button className="k-move-btn" onClick={() => moveTask(task.id, col.id === 'Doing' ? 'To Do' : 'Doing')}>
                            ← Back
                          </button>
                        )}
                        {col.id !== 'Done' && (
                          <button className="k-move-btn" onClick={() => moveTask(task.id, col.id === 'To Do' ? 'Doing' : 'Done')}>
                            → {col.id === 'To Do' ? 'Start' : 'Complete'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '.8125rem', borderRadius: 'var(--r-md)', border: '2px dashed var(--border)' }}>
                      No tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
