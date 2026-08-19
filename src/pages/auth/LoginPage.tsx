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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      if (!email.trim()) {
        setErrorMessage('Please enter your email address.');
        setIsSubmitting(false);
        return;
      }

      const user = appStore.loginUser(email);
      if (user && user.role) {
        onLoginSuccess(user.role);
      } else {
        setErrorMessage('Invalid login credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    try {
      const user = appStore.loginUser(demoEmail);
      if (user && user.role) {
        onLoginSuccess(user.role);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Quick login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090807] text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#C86D44] text-white flex items-center justify-center font-cursive font-bold text-2xl mx-auto shadow-lg">
            A
          </div>
          <h1 className="font-cursive text-3xl font-bold text-amber-100 tracking-wide">ANNAPURNA Authentication</h1>
          <p className="text-xs text-slate-300">
            Log in to access your campus dining environment (Public for 400+ Students).
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@student.edu or admin@authority.edu"
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-[#C86D44] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-[#C86D44] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'AUTHENTICATING...' : 'SIGN IN TO CAMPUS ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">INSTANT DEMO LOGINS:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('aarav@student.edu')}
              className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              <div>Student Demo</div>
              <div className="text-[9px] font-mono opacity-80">aarav@student.edu</div>
            </button>
            <button
              onClick={() => handleQuickLogin('admin@authority.edu')}
              className="p-2.5 rounded-xl bg-[#C86D44]/20 hover:bg-[#C86D44]/30 border border-[#C86D44]/40 text-amber-300 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              <div>Authority Demo</div>
              <div className="text-[9px] font-mono opacity-80">admin@authority.edu</div>
            </button>
          </div>
        </div>

        {/* Register Redirect */}
        <div className="text-center text-xs text-slate-400 pt-2">
          Need a student dining account?{' '}
          <button
            onClick={onNavigateRegister}
            className="text-[#C86D44] dark:text-amber-300 font-bold hover:underline cursor-pointer"
          >
            Register as Student
          </button>
        </div>
      </div>
    </div>
  );
};
