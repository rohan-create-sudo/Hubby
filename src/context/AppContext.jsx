import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

const initialUser = {
  id: 'u1',
  name: 'Alex Freelancer',
  email: 'alex@example.com',
  role: 'freelancer', // or 'client'
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
};

const initialProjects = [
  {
    id: 'p1',
    title: 'E-commerce Website Redesign',
    clientName: 'TechCorp Industries',
    deadline: '2026-05-15',
    status: 'In Progress',
    description: 'A complete overhaul of the existing e-commerce platform using Next.js and Tailwind CSS. Focus on mobile responsiveness and conversion rate optimization.'
  },
  {
    id: 'p2',
    title: 'Brand Identity System',
    clientName: 'Nova Startups',
    deadline: '2026-04-30',
    status: 'Pending',
    description: 'Logo, color palette, and typography guidelines for a new fintech startup.'
  },
  {
    id: 'p3',
    title: 'Mobile App MVP',
    clientName: 'HealthPlus',
    deadline: '2026-06-01',
    status: 'Completed',
    description: 'Initial version of a fitness tracking mobile application.'
  }
];

const initialTasks = [
  { id: 't1', projectId: 'p1', title: 'Design System creation', status: 'Done', description: 'Create foundational components in Figma' },
  { id: 't2', projectId: 'p1', title: 'Header & Navigation', status: 'Doing', description: 'Implement responsive header component' },
  { id: 't3', projectId: 'p1', title: 'Product Listing Page', status: 'To Do', description: 'Grid layout for products with filtering' },
  { id: 't4', projectId: 'p2', title: 'Logo Concepts', status: 'Doing', description: 'Draft 3 initial concepts' },
  { id: 't5', projectId: 'p3', title: 'User Onboarding Flow', status: 'Done', description: 'Screens for sign up and profile setup' }
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [projects, setProjects] = useState(initialProjects);
  const [tasks, setTasks] = useState(initialTasks);

  const loginContext = (email, role) => {
    setUser({ ...initialUser, email, role, name: role === 'client' ? 'Client User' : 'Alex Freelancer' });
  };

  const logoutContext = () => {
    setUser(null);
  };

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
      user,
      loginContext,
      logoutContext,
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
