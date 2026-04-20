import React from 'react';
import { UploadCloud, File, FileText, Image as ImageIcon, MoreVertical, Download, Trash2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Files = () => {
  const { projects } = useAppContext();
  
  const filesList = [
    { id: 1, name: 'Brand_Guidelines_v2.pdf', type: 'pdf', size: '4.2 MB', date: 'Oct 24, 2026', project: 'Brand Identity System' },
    { id: 2, name: 'Homepage_Hero_Mockup.png', type: 'image', size: '1.8 MB', date: 'Oct 23, 2026', project: 'E-commerce Website Redesign' },
    { id: 3, name: 'Project_Requirements.docx', type: 'doc', size: '845 KB', date: 'Oct 20, 2026', project: 'Mobile App MVP' },
    { id: 4, name: 'Logo_Concepts_Presentation.pdf', type: 'pdf', size: '5.6 MB', date: 'Oct 25, 2026', project: 'Brand Identity System' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'image': return <ImageIcon className="text-info" size={24} />;
      case 'pdf': return <FileText className="text-primary" size={24} />;
      case 'doc': return <File className="text-info" size={24} />;
      default: return <File className="text-muted" size={24} />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-bold">Files</h1>
          <p className="text-muted text-sm mt-1">Manage all project files and assets</p>
        </div>
        <button className="btn btn-primary">
          <UploadCloud size={16} /> Upload Files
        </button>
      </div>

      {/* Drag & Drop Area */}
      <div className="card mb-8">
        <div className="p-10 border-2 border-dashed border-gray-200 rounded-lg m-4 bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <UploadCloud size={32} className="text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Click or drag files to upload</h3>
          <p className="text-muted text-sm max-w-md">SVG, PNG, JPG, PDF or DOCX (max. 10MB)</p>
        </div>
      </div>

      {/* Files Table */}
      <div className="card">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold">Recent Uploads</h3>
          <div className="flex gap-2">
            <select className="input py-1 text-sm bg-white" style={{ width: 'auto' }}>
              <option>All Projects</option>
              {projects.map(p => <option key={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-white text-muted text-sm">
                <th className="font-medium p-4">Name</th>
                <th className="font-medium p-4">Project</th>
                <th className="font-medium p-4">Size</th>
                <th className="font-medium p-4">Date Modified</th>
                <th className="font-medium p-4text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filesList.map((file) => (
                <tr key={file.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded">
                      {getIcon(file.type)}
                    </div>
                    <span className="font-medium text-sm">{file.name}</span>
                  </td>
                  <td className="p-4 text-sm text-muted">{file.project}</td>
                  <td className="p-4 text-sm text-muted">{file.size}</td>
                  <td className="p-4 text-sm text-muted">{file.date}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-muted">
                      <button className="hover:text-main p-1"><Download size={16} /></button>
                      <button className="hover:text-primary p-1"><Trash2 size={16} /></button>
                      <button className="hover:text-main p-1"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Files;
