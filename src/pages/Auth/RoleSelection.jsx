import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { Briefcase, Building2 } from 'lucide-react';
import { auth, db } from '../../firebase';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('freelancer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    const user = auth.currentUser;
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { role });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-logo">
        <div className="auth-logo-mark">L</div>
        <span className="auth-logo-name">Lance</span>
      </div>
      <h2 className="auth-heading">How will you use Lance?</h2>
      <p className="auth-sub">Choose your role — you can't change this later</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        <div
          className={`role-card${role === 'freelancer' ? ' selected' : ''}`}
          onClick={() => setRole('freelancer')}
        >
          <div className="role-icon">
            <Briefcase size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '.9375rem' }}>I'm a Freelancer</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Manage projects, invite clients, and deliver work.
            </div>
          </div>
        </div>

        <div
          className={`role-card${role === 'client' ? ' selected' : ''}`}
          onClick={() => setRole('client')}
        >
          <div className="role-icon">
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '.9375rem' }}>I'm a Client</div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Collaborate with freelancers and track progress.
            </div>
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button
        className="btn btn-primary"
        style={{ marginTop: 28, width: '100%', justifyContent: 'center' }}
        onClick={handleContinue}
        disabled={loading}
      >
        {loading ? 'Setting up…' : 'Complete Setup →'}
      </button>
    </div>
  );
};

export default RoleSelection;
