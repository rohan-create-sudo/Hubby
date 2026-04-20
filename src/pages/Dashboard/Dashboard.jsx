import React from 'react';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, projects, tasks } = useAppContext();

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'To Do' || t.status === 'Doing').length;

  const recentActivity = [
    { id: 1, action: 'You completed a task', target: 'Design System creation', time: '2 hours ago' },
    { id: 2, action: 'Client reviewed', target: 'Logo Concepts', time: '5 hours ago' },
    { id: 3, action: 'New project added', target: 'E-commerce Website Redesign', time: '1 day ago' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Good morning, {user?.name.split(' ')[0]}</h1>
          <p className="text-muted">Here's what's happening with your projects today.</p>
        </div>
        <Link to="/projects">
          <button className="btn btn-primary">New Project</button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="card p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary-light text-primary">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium">Active Projects</p>
            <p className="text-2xl font-bold">{activeProjects}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center gap-4">
          <div className="p-4 rounded-full text-success" style={{ backgroundColor: 'var(--color-success-bg)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium">Completed Projects</p>
            <p className="text-2xl font-bold">{completedProjects}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center gap-4">
          <div className="p-4 rounded-full text-warning" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
            <Clock size={24} />
          </div>
          <div>
            <p className="text-muted text-sm font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold">{pendingTasks}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>
        {/* Active Projects List */}
        <div className="card">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-bold">Active Projects</h2>
            <Link to="/projects" className="text-primary text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="p-0">
            {projects.filter(p => p.status === 'In Progress' || p.status === 'Pending').map(project => (
              <div key={project.id} className="p-4 border-b last:border-0 hover:bg-gray-50 flex justify-between items-center transition-colors" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted">{project.clientName}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`badge mb-1 ${project.status === 'Pending' ? 'badge-warning' : 'badge-info'}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-muted">Due {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="p-6 border-b">
            <h2 className="font-bold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <ul className="relative flex flex-col gap-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-gray-200" style={{ paddingLeft: '1.5rem' }}>
              {recentActivity.map((activity, i) => (
                <li key={activity.id} className="relative">
                  <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white box-content"></span>
                  <p className="text-sm">
                    <span className="text-muted">{activity.action}</span>
                    <br />
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <span className="text-xs text-muted block mt-1">{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
