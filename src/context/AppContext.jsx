import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const initialProjects = [
  {
    id: 'p1',
    title: 'E-commerce Website Redesign',
    clientName: 'TechCorp Industries',
    deadline: '2026-05-15',
    status: 'In Progress',
    description: 'A complete overhaul...'
  }
];

const initialTasks = [
  { id: 't1', projectId: 'p1', title: 'Design System creation', status: 'Done' }
];

export const AppProvider = ({ children }) => {
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);

  const addProject = (project) => {
    setProjects([...projects, { ...project, id: `p${Date.now()}` }]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: `t${Date.now()}` }]);
  };

  return (
    <AppContext.Provider value={{
      projects,
      addProject,
      tasks,
      updateTaskStatus,
      addTask,
      setProjects
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);