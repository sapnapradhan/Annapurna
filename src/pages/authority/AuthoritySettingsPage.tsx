import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { Shield, Lock, CheckCircle2, AlertCircle, KeyRound, Save } from 'lucide-react';

export const AuthoritySettingsPage: React.FC = () => {
  const user = appStore.getCurrentUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live password validation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmNewPassword;
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isValid) {
      setErrorMessage('New password does not satisfy security requirements.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await appStore.changeAuthorityPassword(newPassword);
      if (res.success) {
        setSuccessMessage(res.message || 'Authority password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setErrorMessage(res.message || 'Failed to update password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Password change failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Authority Security & Account Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage administrative security credentials and update account access keys safely via Supabase Auth.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Change Authority Password</span>
          </h3>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/30"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Updating...' : 'Update Password via Supabase Auth'}</span>
          </button>
        </form>

        {/* Security Policy Panel */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-3">
            Security & Role Policy
          </h3>

          <div className="space-y-2 text-slate-400">
            <div>
              <span className="text-slate-200 font-semibold block">Authenticated Admin:</span>
              <span>{user.name} ({user.block})</span>
            </div>
            <div>
              <span className="text-slate-200 font-semibold block">Role Protection:</span>
              <span className="text-amber-300 font-mono font-semibold">ROLE_AUTHORITY (Secured via RLS)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1 mt-2">
              <div className="font-semibold text-amber-300">Security Guarantee:</div>
              <div>Passwords are updated directly using Supabase Auth cryptographic API endpoints and are never saved in LocalStorage, database tables, or repository files.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
