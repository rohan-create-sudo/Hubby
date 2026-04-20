import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, MessageSquare, Files, Users, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { user, logoutContext } = useAppContext();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Files', path: '/files', icon: Files },
    ...(user?.role === 'freelancer' ? [{ name: 'Invite Client', path: '/invite', icon: Users }] : []),
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="sidebar" style={{ backgroundColor: 'var(--color-bg-sidebar)', color: 'var(--color-text-main)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
      <div className="p-6 border-b">
        <h1 className="text-primary font-bold text-xl" style={{ fontSize: '1.5rem', letterSpacing: '-0.025em' }}>LANCE</h1>
        <p className="text-xs text-muted mt-1" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workspace</p>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <ul className="px-3 flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary text-white font-medium shadow-sm' 
                      : 'text-muted hover:bg-white hover:text-main'
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' } : {}}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t">
        <button 
          onClick={logoutContext}
          className="flex items-center gap-3 px-3 py-2 w-full text-left text-muted hover:bg-white hover:text-primary rounded-md transition-colors"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
