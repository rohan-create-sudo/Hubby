import React, { useState } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const TaskManager = () => {
  const { tasks, updateTaskStatus } = useAppContext();
  
  const columns = [
    { id: 'To Do', title: 'To Do', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { id: 'Doing', title: 'In Progress', color: 'bg-info-bg text-info border-blue-200' },
    { id: 'Done', title: 'Completed', color: 'bg-success-bg text-success border-green-200' }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Tasks</h1>
          <p className="text-muted text-sm mt-1">Manage ongoing work across all projects</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max h-full pb-4">
          {columns.map(column => (
            <div key={column.id} className="w-80 flex flex-col h-full bg-gray-50 rounded-lg border">
              <div className="p-3 border-b bg-white rounded-t-lg flex justify-between items-center">
                <h3 className={`text-sm font-semibold px-2 py-1 rounded-full ${column.color}`}>
                  {column.title} <span className="ml-1 opacity-70">({tasks.filter(t => t.status === column.id).length})</span>
                </h3>
                <button className="text-muted hover:text-main"><Plus size={16} /></button>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
                {tasks.filter(t => t.status === column.id).map(task => (
                  <div key={task.id} className="bg-white p-3 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-grab group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-main leading-snug">{task.title}</h4>
                      <GripVertical size={14} className="text-gray-300 group-hover:text-gray-500" />
                    </div>
                    <p className="text-xs text-muted mb-3 line-clamp-2">{task.description}</p>
                    
                    <div className="flex justify-between items-center pt-2 border-t mt-auto">
                      <span className="text-[10px] uppercase font-bold text-muted bg-gray-100 px-2 py-1 rounded">Project</span>
                      
                      {/* Fake Interactive move buttons to simulate drag & drop logic */}
                      <div className="flex gap-1">
                        {column.id !== 'To Do' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, 'To Do')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded text-xs transition-colors"
                          >
                            ←
                          </button>
                        )}
                        {column.id !== 'Done' && (
                          <button 
                            onClick={() => updateTaskStatus(task.id, column.id === 'To Do' ? 'Doing' : 'Done')}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded text-xs transition-colors"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
