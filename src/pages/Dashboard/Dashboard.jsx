import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { FolderKanban, CheckSquare, CheckCircle2, Clock, Plus } from 'lucide-react';

const statusClass = (s) => {
  if (s === 'Completed') return 'badge-success';
  if (s === 'In Progress') return 'badge-info';
  if (s === 'Delayed') return 'badge-danger';
  return 'badge-warning';
};

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const field = userProfile?.role === 'client' ? 'clientId' : 'freelancerId';

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'projects'),
      where(field, '==', currentUser.uid)
    );
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [currentUser, field]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', currentUser.uid));
    const unsub = onSnapshot(q, snap => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser]);

  const active    = projects.filter(p => p.status === 'In Progress').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const pending   = tasks.filter(t => t.status !== 'Done').length;

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Good morning, {userProfile?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p className="page-subtitle">Here's an overview of your workspace today.</p>
          </div>
          {userProfile?.role === 'freelancer' && (
            <Link to="/projects">
              <button className="btn btn-primary"><Plus size={16} /> New Project</button>
            </Link>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-cols-3" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-icon blue"><FolderKanban /></div>
          <div>
            <div className="stat-label">Active Projects</div>
            <div className="stat-value">{active}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle2 /></div>
          <div>
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completed}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><Clock /></div>
          <div>
            <div className="stat-label">Pending Tasks</div>
            <div className="stat-value">{pending}</div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Your Projects</span>
          <Link to="/projects" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FolderKanban size={28} /></div>
            <div className="empty-state-title">No projects yet</div>
            <div className="empty-state-desc">
              {userProfile?.role === 'freelancer'
                ? 'Create your first project to get started.'
                : 'Your freelancer hasn\'t added you to a project yet.'}
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 6).map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{p.description?.slice(0, 55)}{p.description?.length > 55 ? '…' : ''}</div>
                    </td>
                    <td><span className={`badge ${statusClass(p.status)}`}>{p.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '.8125rem' }}>
                      {p.deadline ? new Date(p.deadline).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
