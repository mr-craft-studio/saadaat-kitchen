import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { BrandLogo } from '../components/BrandLogo.tsx';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onBackToWebsite: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const { login, isAuthenticated, adminEmail, logout } = useAuth();
  const [email, setEmail] = useState('admin@saadaatkitchen.com');
  const [password, setPassword] = useState('Saadaat@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(result.error || 'Invalid credentials or account locked.');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-zinc-800 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-white">Already Authenticated</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Logged in as <span className="text-amber-400 font-semibold">{adminEmail}</span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={onLoginSuccess}
              className="w-full py-3 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow cursor-pointer"
            >
              Open Admin Dashboard
            </button>
            <button
              onClick={logout}
              className="w-full py-2.5 text-xs text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="md" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Private Restaurant Management</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">
            Administrator Sign In
          </h1>
          <p className="text-xs text-zinc-400">
            Secure password-protected access for kitchen staff and managers.
          </p>
        </div>

        {/* Login Box */}
        <div className="p-8 rounded-3xl glass-panel-gold border border-amber-500/20 shadow-2xl space-y-6 bg-zinc-950">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@saadaatkitchen.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNotice(!showForgotNotice)}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {showForgotNotice && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 space-y-1">
                <span className="font-bold text-amber-400 block">Password Recovery Policy:</span>
                <p>
                  To protect customer records and payment verifications, admin passwords can only be reset directly through the server configuration or authorized super-administrator.
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-850 text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Security Rate Limiting:</span>
              <span className="text-zinc-300 font-semibold">Active (5 Attempts)</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-xs font-bold text-zinc-950 gold-gradient-bg rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToWebsite}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
