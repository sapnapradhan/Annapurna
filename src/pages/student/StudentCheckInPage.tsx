import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { 
  QrCode, CheckCircle2, AlertCircle, Camera, ShieldCheck, Clock, Building, ArrowLeft, RefreshCw 
} from 'lucide-react';

interface StudentCheckInPageProps {
  selectedMealId?: string;
  onNavigate: (tab: string) => void;
}

export const StudentCheckInPage: React.FC<StudentCheckInPageProps> = ({ 
  selectedMealId = 'meal-today-dinner',
  onNavigate
}) => {
  const user = appStore.getCurrentUser();
  const meals = appStore.getMeals();
  const meal = meals.find(m => m.id === selectedMealId) || meals[0];

  const [isScanning, setIsScanning] = useState(false);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [liveAttendance, setLiveAttendance] = useState(
    appStore.getLiveAttendance(meal?.id)
  );

  useEffect(() => {
    const update = () => setLiveAttendance(appStore.getLiveAttendance(meal?.id));
    return appStore.subscribe(update);
  }, [meal?.id]);

  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `ANNAPURNA-BCU-STUDENT-PASS:${user.id}:${meal.id}:${Date.now()}`
  )}`;

  const handleExecuteScan = () => {
    setIsScanning(true);

    // Simulate active camera scanner alignment before verification
    setTimeout(() => {
      appStore.recordCheckin(meal.id, 'mess-1');
      setIsScanning(false);
      setCheckinSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-full bg-white/10 dark:bg-black/30 border border-white/20 hover:border-[#C86D44] text-slate-700 dark:text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-cursive font-bold text-2xl text-[#2C221E] dark:text-amber-100">
            Hostel Mess QR Turnstile Scanner
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
            {user.hostel || 'Hostel 1 - Mahanadi Hall'} • Turnstile Gate A1
          </p>
        </div>
      </div>

      {/* QR Checkin Container */}
      <div className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl text-center space-y-6">
        {checkinSuccess ? (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/40 shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="font-cursive font-bold text-3xl text-emerald-600 dark:text-emerald-400">
                Turnstile Pass Verified!
              </h2>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300">
                Pass Verified for {user.name} • {meal.title}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-200">
              ✅ Enjoy your meal! Your turnstile scan has been verified and sent directly as a real-time notification to the Authority Admin.
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
            >
              Return to Student Home
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* REAL SCANNABLE QR CODE CONTAINER */}
            <div className="relative w-56 h-56 mx-auto p-4 rounded-3xl bg-white border-4 border-[#C86D44]/40 shadow-2xl flex items-center justify-center">
              <img
                src={qrDataUrl}
                alt="Real Scannable QR Code Pass"
                className="w-full h-full object-contain"
              />

              {/* Viewfinder scanning laser animation */}
              {isScanning && (
                <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl flex items-center justify-center border-2 border-emerald-400">
                  <div className="w-full h-1 bg-emerald-400 shadow-lg shadow-emerald-400 animate-pulse" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C86D44]/20 border border-[#C86D44]/30 text-[#C86D44] dark:text-amber-300 text-xs font-mono font-bold uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>{meal.title} Pass (BCU-2026)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                Real scannable QR Code. Hold your smartphone or click below to align camera scanner with turnstile reader.
              </p>
            </div>

            {/* Dynamic Attendance Counter */}
            <div className="p-3 rounded-2xl bg-white/10 dark:bg-black/40 border border-white/10 text-xs font-mono text-center">
              Live Turnstile Attendance: <span className="font-bold text-[#C86D44] dark:text-amber-300">{liveAttendance.checkinCount} / {liveAttendance.totalRegistered}</span> ({liveAttendance.percentage}%)
            </div>

            <button
              onClick={handleExecuteScan}
              disabled={isScanning}
              className="w-full py-4 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>VERIFYING SCANNER ALIGNMENT...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>🍱 SCAN & VERIFY TURNSTILE PASS</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
