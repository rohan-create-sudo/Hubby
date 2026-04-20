import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/role');
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">Create an account</h2>
        <p className="text-muted text-sm mt-1">Join Lance to manage your projects</p>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              required
              placeholder="Alex Freelancer" 
              className="input pl-10" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input 
              type="email" 
              required
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

        <button type="submit" className="btn btn-primary w-full mt-4 py-2">
          Continue
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
