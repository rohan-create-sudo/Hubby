import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  MessageSquare, Files, UserPlus, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard',    path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects',     path: '/projects',  icon: FolderKanban },
    { name: 'Tasks',        path: '/tasks',     icon: CheckSquare },
    { name: 'Messages',     path: '/chat',      icon: MessageSquare },
    { name: 'Files',        path: '/files',     icon: Files },
    ...(userProfile?.role === 'freelancer'
      ? [{ name: 'Invite Client', path: '/invite', icon: UserPlus }]
      : []),
    { name: 'Settings',     path: '/settings',  icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">L</div>
        <div>
          <div className="sidebar-logo-text">Lance</div>
          <div className="sidebar-logo-sub">Workspace</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        <ul>
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <item.icon size={18} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / User */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={handleLogout} title="Log out">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userProfile?.name || 'Your Account'}</div>
            <div className="sidebar-user-role">{userProfile?.role || '—'}</div>
          </div>
          <LogOut size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
