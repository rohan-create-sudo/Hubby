import React from 'react';
import { Send, Phone, Video, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Chat = () => {
  const { user } = useAppContext();
  
  const contacts = [
    { id: 1, name: 'TechCorp Industries', role: 'Client', active: true, unread: 2, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Nova Startups', role: 'Client', active: false, unread: 0, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'HealthPlus', role: 'Client', active: true, unread: 0, avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    <div className="card h-full flex overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Sidebar List */}
      <div className="w-1/3 border-r flex flex-col bg-white">
        <div className="p-4 border-b">
          <input type="text" placeholder="Search messages..." className="input w-full bg-gray-50" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact, i) => (
            <div key={contact.id} className={`p-4 border-b flex items-center gap-3 cursor-pointer transition-colors ${i === 0 ? 'bg-primary-light border-l-4' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`} style={{ borderLeftColor: i === 0 ? 'var(--color-primary)' : 'transparent' }}>
              <div className="relative">
                <img src={contact.avatar} className="w-10 h-10 rounded-full object-cover border" alt={contact.name} />
                {contact.active && <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></span>}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
                  <span className="text-xs text-muted">10:42 AM</span>
                </div>
                <p className="text-xs text-muted truncate">
                  {i === 0 ? 'Thanks for the update, looking forward to it!' : 'Sounds good.'}
                </p>
              </div>
              {contact.unread > 0 && (
                <span className="bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {contact.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="h-16 border-b bg-white px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={contacts[0].avatar} className="w-8 h-8 rounded-full" alt="Client" />
            <div>
              <h3 className="font-semibold text-sm">{contacts[0].name}</h3>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success block"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-muted">
            <button className="hover:text-primary transition-colors"><Phone size={18} /></button>
            <button className="hover:text-primary transition-colors"><Video size={18} /></button>
            <button className="hover:text-primary transition-colors"><Info size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <div className="text-center">
            <span className="text-xs text-muted bg-white px-3 py-1 rounded-full border shadow-sm">Today</span>
          </div>

          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-tl-sm p-3 max-w-[70%] shadow-sm text-sm">
              <p>Hi {user?.name.split(' ')[0]}, can we schedule a quick call tomorrow to review the new designs?</p>
              <span className="text-[10px] text-muted block mt-1 text-right">10:30 AM</span>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-primary text-white rounded-2xl rounded-tr-sm p-3 max-w-[70%] shadow-sm text-sm">
              <p>Of course! I have times available at 11 AM or 2 PM. Does either work for you?</p>
              <span className="text-[10px] text-primary-light block mt-1 text-right">10:35 AM</span>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-tl-sm p-3 max-w-[70%] shadow-sm text-sm">
              <p>11 AM is perfect. Thanks for the update, looking forward to it!</p>
              <span className="text-[10px] text-muted block mt-1 text-right">10:42 AM</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted hover:bg-gray-100 rounded-full transition-colors">
              <Plus size={20} />
            </button>
            <input type="text" placeholder="Type your message..." className="input flex-1 bg-gray-50 border-transparent focus:bg-white" />
            <button className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors shadow-sm">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
