import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, MoreVertical, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const ProjectList = () => {
  const { projects } = useAppContext();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted">Manage your active and completed projects.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {projects.map(project => (
          <div key={project.id} className="card p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-gray-100 text-muted">
                <FolderKanban size={24} />
              </div>
              <button className="text-muted hover:text-main">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <Link to={`/projects/${project.id}`} className="font-bold text-lg hover:text-primary transition-colors block mb-1">
                {project.title}
              </Link>
              <p className="text-sm text-muted">{project.clientName}</p>
            </div>
            
            <p className="text-sm text-muted line-clamp-2 mb-6" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {project.description}
            </p>
            
            <div className="border-t pt-4 flex justify-between items-center">
              <span className={`badge ${
                project.status === 'Completed' ? 'badge-success' :
                project.status === 'In Progress' ? 'badge-info' : 'badge-warning'
              }`}>
                {project.status}
              </span>
              <span className="text-xs text-muted font-medium">
                Due: {new Date(project.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
