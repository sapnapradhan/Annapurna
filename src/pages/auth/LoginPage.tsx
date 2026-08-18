import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { UserRole } from '../../types';
import { Mail, Lock, LogIn, UtensilsCrossed, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await appStore.login({
        email,
        password
      });

      if (res.success && res.role) {
        onLoginSuccess(res.role);
      } else {
        setErrorMessage(res.message || 'Invalid email or password credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-cinematic-surface border border-cinematic-border shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-emerald-400 p-0.5 mx-auto shadow-lg shadow-amber-950/30">
            <div className="w-full h-full bg-[#0a0c14] rounded-[14px] flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">ANNAPURNA Authentication</h1>
          <p className="text-xs text-slate-400">
            Log in to access your authorized campus dining environment.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="student@campus.edu or admin@mess.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-950/30"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Campus Account'}</span>
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Instant Test Logins:</div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => { setEmail('aarav@student.edu'); setPassword('Student@123'); }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-left border border-slate-800"
            >
              <div className="font-bold">Student Demo</div>
              <div className="text-[10px] text-slate-400 truncate">aarav@student.edu</div>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('admin@authority.edu'); setPassword('Authority@123'); }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-left border border-slate-800"
            >
              <div className="font-bold">Authority Demo</div>
              <div className="text-[10px] text-slate-400 truncate">admin@authority.edu</div>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-2 text-center text-xs text-slate-400">
          Need a student dining account?{' '}
          <button
            onClick={onNavigateRegister}
            className="text-amber-400 font-semibold hover:underline"
          >
            Register as Student
          </button>
        </div>
      </div>
    </div>
  );
};
