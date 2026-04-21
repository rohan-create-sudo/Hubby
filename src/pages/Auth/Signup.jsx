import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { User, Mail, Lock } from 'lucide-react';
import { auth, db, googleProvider } from '../../firebase';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Store partial profile; role assigned on next screen
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        role: '',
        createdAt: serverTimestamp(),
      });
      navigate('/role');
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth.*\)/, ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email,
          role: '',
          createdAt: serverTimestamp(),
        });
        navigate('/role');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth.*\)/, ''));
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
      <h2 className="auth-heading">Create your account</h2>
      <p className="auth-sub">Start managing projects for free</p>

      <button onClick={handleGoogle} className="btn-google" disabled={loading}>
        <GoogleIcon /> Continue with Google
      </button>

      <div className="auth-divider"><span>or register with email</span></div>

      <form onSubmit={handleEmailSignup}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="input-icon-wrap">
            <User className="input-icon" />
            <input className="input" type="text" required placeholder="Alex Smith"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email address</label>
          <div className="input-icon-wrap">
            <Mail className="input-icon" />
            <input className="input" type="email" required placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-icon-wrap">
            <Lock className="input-icon" />
            <input className="input" type="password" required minLength={6} placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        {error && <div className="error-msg">{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ marginTop: 20, width: '100%', justifyContent: 'center' }} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;
