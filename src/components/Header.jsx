import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { userProfile } = useAuth();

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="header">
      <div className="header-search">
        <Search className="header-search-icon" />
        <input type="text" placeholder="Search projects, tasks…" />
      </div>

      <div className="header-actions">
        <button className="header-icon-btn">
          <Bell size={18} strokeWidth={1.8} />
          <span className="header-notif-dot" />
        </button>

        <div className="header-divider" />

        <div className="header-profile">
          <div className="header-avatar">{initials}</div>
          <div>
            <div className="header-user-name">{userProfile?.name || 'User'}</div>
            <div className="header-user-role">{userProfile?.role || '—'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
