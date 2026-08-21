import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { 
  ShieldCheck, Lock, Key, CheckCircle2, AlertCircle, Save, UserCheck, Shield 
} from 'lucide-react';

export const AuthoritySettingsPage: React.FC = () => {
  const currentUser = appStore.getCurrentUser();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [messName, setMessName] = useState('Central Dining Hall — Kalinga Campus');
  const [contactEmail, setContactEmail] = useState(currentUser.email || 'admin@authority.edu');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      appStore.updateAdminPassword(currentPassword, newPassword);
      setSuccessMessage('Authority Admin password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update admin password.');
    }
  };

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      <div className="border-b border-[#EBE4D8] dark:border-[#2C2724] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AUTHORITY ADMIN SECURITY & SYSTEM SETTINGS</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-white mt-1">
          Authority Settings & Credential Security
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
          Only authenticated Authority Admins can modify system credentials & password.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Section 1: Authority Admin Password & Credential Security */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Lock className="w-5 h-5 text-[#C86D44] dark:text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-[#2C221E] dark:text-white">
              Change Authority Admin Password
            </h2>
          </div>

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                Active Admin Email
              </label>
              <input
                type="text"
                disabled
                value={currentUser.email}
                className="w-full bg-white/5 dark:bg-black/50 border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#C86D44]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                New Admin Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#C86D44]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#C86D44]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>UPDATE ADMIN PASSWORD</span>
            </button>
          </form>
        </div>

        {/* Section 2: Mess Facility Profile */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <UserCheck className="w-5 h-5 text-[#C86D44] dark:text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-[#2C221E] dark:text-white">
              Campus Dining Facility Profile
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Facility Name</label>
              <input
                type="text"
                value={messName}
                onChange={(e) => setMessName(e.target.value)}
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 font-semibold text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Operations Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 font-semibold text-white focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px]">
              🔒 SECURITY NOTICE: All credential & password changes take effect immediately and persist across sessions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
