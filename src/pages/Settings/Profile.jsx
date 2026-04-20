import React from 'react';
import { User, Mail, Shield, Bell, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Profile = () => {
  const { user } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-muted text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
        {/* Settings Navigation */}
        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-primary-light text-primary rounded-md text-left">
            <User size={16} /> Profile
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted hover:bg-gray-50 hover:text-main rounded-md text-left transition-colors">
            <Shield size={16} /> Security
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted hover:bg-gray-50 hover:text-main rounded-md text-left transition-colors">
            <Bell size={16} /> Notifications
          </button>
        </div>

        {/* Profile Form Content */}
        <div className="card">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-lg">Profile Information</h2>
            <p className="text-sm text-muted">Update your personal information and avatar.</p>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
              <img 
                src={user?.avatar} 
                className="w-20 h-20 rounded-full border shadow-sm"
                alt="Profile avatar" 
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <div>
                <div className="flex gap-3 mb-2">
                  <button className="btn btn-secondary text-xs">Change Avatar</button>
                  <button className="text-primary text-xs font-medium hover:underline">Remove</button>
                </div>
                <p className="text-xs text-muted">JPG, GIF or PNG. Max size of 2MB.</p>
              </div>
            </div>

            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label className="block text-sm font-medium mb-1 border-gray-100">First Name</label>
                  <input type="text" className="input" defaultValue={user?.name.split(' ')[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input type="text" className="input" defaultValue={user?.name.split(' ')[1]} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
                  <input type="email" className="input pl-10" defaultValue={user?.email} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Role / Bio</label>
                <textarea className="input min-h-[100px] resize-none" defaultValue="I'm a full-stack developer focusing on building robust SaaS applications." style={{ minHeight: '100px' }}></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" className="btn btn-primary">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
