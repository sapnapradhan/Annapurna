import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { UserRole } from '../../types';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, GraduationCap, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onNavigateRegister: () => void;
  onLoginSuccess: (role: UserRole) => void;
  onBackToHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateRegister,
  onLoginSuccess,
  onBackToHome
}) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const emailToUse = email.trim() || (selectedRoleTab === 'authority' ? 'admin@authority.edu' : 'aarav@student.edu');
      const user = appStore.loginUser(emailToUse, selectedRoleTab);
      onLoginSuccess(user?.role || selectedRoleTab);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (demoEmail: string, role: UserRole) => {
    try {
      setSelectedRoleTab(role);
      const user = appStore.loginUser(demoEmail, role);
      onLoginSuccess(user?.role || role);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Quick login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090807] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative">
      {/* Top Left Back to Home Button */}
      {onBackToHome && (
        <div className="absolute top-6 left-6 z-20">
          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-2 backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>BACK TO HOME</span>
          </button>
        </div>
      )}

      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-white/10 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Official Website Logo Emblem */}
        <div className="text-center space-y-2">
          <img 
            src="/logo.png" 
            alt="ANNAPURNA Logo" 
            className="h-16 w-auto mx-auto object-contain drop-shadow-md" 
          />
          <h1 className="font-cursive text-3xl font-bold text-amber-100 tracking-wide">
            ANNAPURNA Portal
          </h1>
          <p className="text-xs text-slate-300 font-mono">
            Campus Dining & Food Operations Login
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setSelectedRoleTab('student');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRoleTab === 'student'
                ? 'bg-[#C86D44] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>STUDENT LOGIN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRoleTab('authority');
              setErrorMessage('');
            }}
            className={`py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRoleTab === 'authority'
                ? 'bg-[#C86D44] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>AUTHORITY LOGIN</span>
          </button>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dedicated Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
              {selectedRoleTab === 'student' ? 'Student Username / Email' : 'Authority Admin ID / Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRoleTab === 'student' ? 'aarav@student.edu or student' : 'admin@authority.edu or admin'}
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
            <span>{isSubmitting ? 'AUTHENTICATING...' : `SIGN IN TO ${selectedRoleTab.toUpperCase()} PORTAL`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">INSTANT DEMO LOGINS:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('aarav@student.edu', 'student')}
              className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-left transition-colors cursor-pointer"
            >
              <div>Student Demo</div>
              <div className="text-[9px] font-mono opacity-80">aarav@student.edu</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@authority.edu', 'authority')}
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
            type="button"
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
