import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, LogOut, Save, Bell } from 'lucide-react';

const Profile = () => {
  const { currentUser, userProfile, logout, refreshProfile } = useAuth();
  const [name, setName] = useState(userProfile?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateDoc(doc(db, 'users', currentUser.uid), { name });
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Settings Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-link${activeTab === tab.id ? ' active' : ''}`}
              style={{ justifyContent: 'flex-start', border: 'none', background: 'none' }}
            >
              <tab.icon size={17} strokeWidth={1.8} />
              {tab.label}
            </button>
          ))}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <button
              onClick={logout}
              className="nav-link"
              style={{ justifyContent: 'flex-start', color: 'var(--danger)', border: 'none', background: 'none', width: '100%' }}
            >
              <LogOut size={17} strokeWidth={1.8} />
              Log Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="card">
          {activeTab === 'profile' && (
            <>
              <div className="card-header">
                <span className="card-title">Profile Information</span>
              </div>
              <div className="card-body">
                {/* Avatar Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 800, border: '3px solid var(--primary-mid)'
                  }}>
                    {initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>{userProfile?.name || 'Your Name'}</div>
                    <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 2 }}>
                      {userProfile?.role} · {userProfile?.email}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label className="form-label">Full Name</label>
                    <div className="input-icon-wrap">
                      <User className="input-icon" />
                      <input className="input" type="text" value={name}
                        onChange={e => setName(e.target.value)} placeholder="Your full name" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <div className="input-icon-wrap">
                      <Mail className="input-icon" />
                      <input className="input" type="email" value={userProfile?.email || ''} disabled
                        style={{ opacity: .7, cursor: 'not-allowed' }} />
                    </div>
                    <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 5 }}>Email cannot be changed here.</p>
                  </div>
                  <div>
                    <label className="form-label">Role</label>
                    <input className="input" value={userProfile?.role || ''} disabled
                      style={{ textTransform: 'capitalize', opacity: .7, cursor: 'not-allowed' }} />
                    <p style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 5 }}>Role is set during signup and cannot be changed.</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 8 }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    {saved && (
                      <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '.875rem' }}>
                        ✓ Saved successfully!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="card-header">
                <span className="card-title">Security Settings</span>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label className="form-label">Current Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <input className="input" type="password" placeholder="Min 6 characters" />
                  </div>
                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input className="input" type="password" placeholder="Repeat new password" />
                  </div>
                  <div>
                    <button className="btn btn-primary" style={{ width: 'fit-content' }}>Update Password</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="card-header">
                <span className="card-title">Notification Preferences</span>
              </div>
              <div className="card-body">
                {[
                  { label: 'New messages received', sub: 'Get notified when someone messages on a project' },
                  { label: 'Task status updates', sub: 'Alerts when tasks are moved or completed' },
                  { label: 'Project status changes', sub: 'Know when a project is marked complete or delayed' },
                  { label: 'New file uploads', sub: 'Notification when a file is uploaded to your project' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '.875rem' }}>{item.label}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, position: 'absolute' }} />
                      <div style={{ width: 42, height: 24, background: 'var(--primary)', borderRadius: 99, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'transform .2s' }} />
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
