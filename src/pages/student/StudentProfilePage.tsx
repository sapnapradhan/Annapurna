import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { User, CalendarCheck, Utensils, Star, Leaf, ChevronRight, Shield, Save } from 'lucide-react';

interface StudentProfilePageProps {
  onNavigate: (tab: string) => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ onNavigate }) => {
  const user = appStore.getCurrentUser();
  const [dietary, setDietary] = useState(user.dietary_pref || 'Vegetarian');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveDietary = (val: string) => {
    setDietary(val);
    appStore.updateProfile({ dietary_pref: val });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Profile Card Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-slate-800 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xl flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-xl">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-100">{user.name}</h2>
          <div className="text-xs text-slate-400 font-mono mt-0.5">Student ID: {user.student_id}</div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
          <span>{user.hostel}</span> • <span>{user.block}</span>
        </div>
      </div>

      {/* Dietary Preference Editor */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">Dietary Preference</span>
          {savedMsg && <span className="text-emerald-400 text-[10px] font-mono">Saved!</span>}
        </div>
        <select
          value={dietary}
          onChange={(e) => handleSaveDietary(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-amber-200 font-semibold focus:outline-none"
        >
          <option value="Vegetarian">Standard Vegetarian</option>
          <option value="Jain">Jain (No Onion / Garlic)</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Vegan">Vegan</option>
        </select>
      </div>

      {/* Quick Navigation Links */}
      <div className="space-y-2">
        {[
          { label: 'My Attendance Ratios', icon: CalendarCheck, target: 'attendance' },
          { label: 'My Meal History Log', icon: Utensils, target: 'my-meals' },
          { label: 'My Submitted Reviews', icon: Star, target: 'my-reviews' },
          { label: 'Personal Impact Summary', icon: Leaf, target: 'impact' },
        ].map((link, idx) => {
          const Icon = link.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(link.target)}
              className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-between text-xs text-slate-200 font-semibold transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>{link.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
