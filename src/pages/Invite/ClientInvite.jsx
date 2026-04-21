import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Mail, Link as LinkIcon, Copy, Check, UserPlus } from 'lucide-react';

const ClientInvite = () => {
  const { currentUser, userProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const inviteLink = `${window.location.origin}/join?ref=${currentUser?.uid}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await addDoc(collection(db, 'invites'), {
      freelancerId: currentUser.uid,
      freelancerName: userProfile?.name || '',
      clientEmail: email.trim(),
      projectId: projectId || '',
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    setLoading(false);
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--r-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <UserPlus size={26} />
          </div>
          <h1 className="page-title">Invite a Client</h1>
          <p className="page-subtitle">Send an email invitation or share your unique invite link</p>
        </div>
      </div>

      {/* Email Invite */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mail size={17} /> Send via Email
          </span>
        </div>
        <div className="card-body">
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Client's Email Address</label>
              <div className="input-icon-wrap">
                <Mail className="input-icon" />
                <input className="input" type="email" required placeholder="client@company.com"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              {sent && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--success)', fontSize: '.875rem', fontWeight: 600 }}>
                  <Check size={16} /> Invite recorded!
                </span>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending…' : 'Send Invite'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Link Invite */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LinkIcon size={17} /> Shareable Link
          </span>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '.875rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            Anyone with this link can sign up as a client and be linked to your workspace.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px' }}>
            <LinkIcon size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '.8125rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {inviteLink}
            </span>
            <button
              onClick={handleCopy}
              className={`btn btn-sm ${copied ? 'btn-secondary' : 'btn-secondary'}`}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, color: copied ? 'var(--success)' : undefined }}
            >
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInvite;
