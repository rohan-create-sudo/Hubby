import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { loginContext } = useAppContext();
  const [role, setRole] = useState('freelancer');

  const handleContinue = () => {
    loginContext('user@example.com', role);
    navigate('/dashboard');
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold">Choose your role</h2>
        <p className="text-muted text-sm mt-1">How will you be using Lance?</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div 
          onClick={() => setRole('freelancer')}
          className={`card p-4 cursor-pointer flex items-center gap-4 border-2 transition-all ${role === 'freelancer' ? 'border-primary bg-primary-light' : 'border-transparent'}`}
        >
          <div className={`p-3 rounded-full ${role === 'freelancer' ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}>
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="font-semibold">I'm a Freelancer</h3>
            <p className="text-xs text-muted">I want to manage projects and clients.</p>
          </div>
        </div>

        <div 
          onClick={() => setRole('client')}
          className={`card p-4 cursor-pointer flex items-center gap-4 border-2 transition-all ${role === 'client' ? 'border-primary bg-primary-light' : 'border-transparent'}`}
        >
          <div className={`p-3 rounded-full ${role === 'client' ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}>
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-semibold">I'm a Client</h3>
            <p className="text-xs text-muted">I want to collaborate with freelancers.</p>
          </div>
        </div>
      </div>

      <button onClick={handleContinue} className="btn btn-primary w-full py-2">
        Complete Setup
      </button>
    </div>
  );
};

export default RoleSelection;
