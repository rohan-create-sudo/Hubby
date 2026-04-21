import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Users, MessageSquare, FolderKanban, Files } from 'lucide-react';

const features = [
  { icon: <FolderKanban size={22} />, title: 'Project Management', desc: 'Create and manage projects with real-time status tracking and deadlines.' },
  { icon: <MessageSquare size={22} />, title: 'Real-time Chat', desc: 'Communicate instantly with clients or freelancers per project.' },
  { icon: <Files size={22} />, title: 'File Sharing', desc: 'Upload, version, and share project files securely via cloud storage.' },
  { icon: <Users size={22} />, title: 'Role-based Access', desc: 'Separate dashboards and permissions for freelancers and clients.' },
  { icon: <Zap size={22} />, title: 'Task Kanban', desc: 'Visualize work with a drag-style kanban board across all projects.' },
  { icon: <Shield size={22} />, title: 'Secure Auth', desc: 'Google sign-in and email auth with Firebase Security Rules.' },
];

const Landing = () => {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="auth-logo-mark">L</div>
          <span style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-.02em' }}>Lance</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-badge">
          <Zap size={12} /> The freelancer-client workspace
        </div>
        <h1 className="landing-h1">
          Where great work <span>gets done</span> together
        </h1>
        <p className="landing-desc">
          Lance gives freelancers and clients a private, professional workspace to manage projects, communicate in real time, and deliver outstanding results.
        </p>
        <div className="landing-cta">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start for free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="landing-features">
          {features.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--primary)' }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        © {new Date().getFullYear()} Lance Platform · Built for freelancers & clients
      </footer>
    </div>
  );
};

export default Landing;
