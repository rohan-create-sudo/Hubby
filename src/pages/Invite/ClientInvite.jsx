import React, { useState } from 'react';
import { Mail, Link as LinkIcon, Check, Copy } from 'lucide-react';

const ClientInvite = () => {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://lance.app/invite/ref-ab89xy';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    setEmail('');
    alert('Invite sent successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={28} />
        </div>
        <h1 className="text-xl font-bold">Invite a Client</h1>
        <p className="text-muted mt-2">Send an email invitation or share the direct link so your clients can easily collaborate with you.</p>
      </div>

      <div className="card p-8 mb-6 shadow-md">
        <h2 className="font-semibold mb-4 text-lg">Send via Email</h2>
        <form onSubmit={handleSend} className="flex gap-4">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@company.com" 
              className="input pl-10 h-10 w-full" 
            />
          </div>
          <button type="submit" className="btn btn-primary h-10 px-6">
            Send Invite
          </button>
        </form>
      </div>

      <div className="card p-8 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-semibold text-lg">Share Link</h2>
            <p className="text-sm text-muted mt-1">Anyone with this link can create a client account linked to your workspace.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 p-2 pl-4 rounded-md border border-gray-200">
          <LinkIcon size={16} className="text-muted" />
          <span className="flex-1 text-sm font-medium select-all overflow-hidden text-ellipsis whitespace-nowrap">
            {inviteLink}
          </span>
          <button 
            onClick={handleCopy}
            className={`btn ${copied ? 'btn-secondary text-success' : 'btn-secondary'} px-3 py-1 flex items-center gap-1.5 h-8 bg-white text-xs`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientInvite;
