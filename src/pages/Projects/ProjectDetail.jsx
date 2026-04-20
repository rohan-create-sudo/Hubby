import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, CalendarDays, User, FileText, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, tasks } = useAppContext();
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  
  if (!project) return <div className="p-8 text-center text-muted">Project not found</div>;

  return (
    <div>
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to projects
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
          <div className="flex gap-4 text-sm text-muted" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <span className="flex items-center gap-1.5"><User size={16} /> {project.clientName}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={16} /> Due {new Date(project.deadline).toLocaleDateString()}</span>
            <span className={`badge ${
              project.status === 'Completed' ? 'badge-success' :
              project.status === 'In Progress' ? 'badge-info' : 'badge-warning'
            }`}>
              {project.status}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="btn btn-secondary">Request Revision</button>
          <button className="btn btn-primary">Mark as Complete</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
        <div className="flex flex-col gap-6">
          <div className="card p-6">
            <h2 className="font-bold flex items-center gap-2 mb-4 border-b pb-4"><FileText size={20} /> Description</h2>
            <p className="text-muted text-sm leading-relaxed">{project.description}</p>
          </div>

          <div className="card">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2"><CheckCircle2 size={20} /> Tasks</h2>
              <button className="text-sm text-primary font-medium hover:underline">+ Add Task</button>
            </div>
            <div className="p-0">
              {projectTasks.length > 0 ? projectTasks.map(task => (
                <div key={task.id} className="p-4 border-b last:border-0 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={task.status === 'Done'} readOnly className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                    <div>
                      <h3 className={`font-medium text-sm ${task.status === 'Done' ? 'line-through text-muted' : ''}`}>{task.title}</h3>
                      <p className="text-xs text-muted">{task.description}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs ${task.status === 'Done' ? 'badge-success' : task.status === 'Doing' ? 'badge-info' : 'badge-neutral'}`}>
                    {task.status}
                  </span>
                </div>
              )) : (
                <div className="p-6 text-center text-muted text-sm">No tasks added yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* File Attachments Widget */}
          <div className="card">
            <div className="p-6 border-b">
              <h2 className="font-bold">Recent Files</h2>
            </div>
            <div className="p-4 text-center">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 text-muted mb-4 cursor-pointer hover:bg-gray-100 transition-colors">
                <p className="text-sm">Drag & drop files here</p>
                <p className="text-xs mt-1">or click to browse</p>
              </div>
              <Link to="/files" className="text-sm text-primary font-medium hover:underline">View all files</Link>
            </div>
          </div>

          {/* Quick Chat Widget */}
          <div className="card flex flex-col h-[400px]" style={{ height: '400px' }}>
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2"><MessageSquare size={20} /> Quick Chat</h2>
            </div>
            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4 bg-gray-50 bg-opacity-50">
              <div className="self-end bg-primary text-white p-3 rounded-lg rounded-tr-sm max-w-[80%] text-sm">
                Hey, any updates on the new designs?
              </div>
              <div className="self-start bg-white border p-3 rounded-lg rounded-tl-sm max-w-[80%] text-sm">
                Working on it right now. I'll upload them in an hour!
              </div>
            </div>
            <div className="p-4 border-t">
              <input type="text" placeholder="Type a message..." className="input bg-gray-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
