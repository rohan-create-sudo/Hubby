import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { user } = useAppContext();

  return (
    <header className="header justify-between">
      <div className="flex items-center gap-4 w-full" style={{ maxWidth: '400px' }}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} style={{ pointerEvents: 'none' }} />
          <input 
            type="text" 
            placeholder="Search projects, tasks..." 
            className="input pl-10 bg-white"
            style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative btn-icon">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l pl-6">
          <div className="flex flex-col text-right">
            <span className="font-semibold text-sm">{user?.name}</span>
            <span className="text-xs text-muted" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
          <img 
            src={user?.avatar} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border shadow-sm"
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
