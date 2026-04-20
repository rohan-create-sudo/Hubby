import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginContext } = useAppContext();
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    loginContext(email || 'user@example.com', 'freelancer');
    navigate('/dashboard');
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">Welcome back</h2>
        <p className="text-muted text-sm mt-1">Enter your details to access your account</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com" 
              className="input pl-10" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="input pl-10" 
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="rounded text-primary" />
            Remember me
          </label>
          <Link to="#" className="text-sm text-primary font-medium hover:underline">Forgot password?</Link>
        </div>

        <button type="submit" className="btn btn-primary w-full mt-4 py-2">
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
