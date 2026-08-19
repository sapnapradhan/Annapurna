import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { 
  Truck, ShieldCheck, CheckCircle2, AlertTriangle, Building2, MapPin, Heart, Send, Clock, Sparkles
} from 'lucide-react';

interface RescueNGO {
  id: string;
  name: string;
  location: string;
  contact: string;
}

const NGOS: RescueNGO[] = [
  { id: 'ngo-1', name: 'Robin Hood Army — Bhubaneswar Chapter', location: 'Saheed Nagar & Patia Hub', contact: '+919861012345' },
  { id: 'ngo-2', name: 'Feeding India by Zomato — Bhubaneswar', location: 'Jayadev Vihar Main Square', contact: '+919437011223' },
  { id: 'ngo-[#C86D44]-3', name: 'Aahaar Kendra — Capital Hospital Hub', location: 'Capital Hospital Premises, Unit 6', contact: '+916742390112' },
  { id: 'ngo-4', name: 'Puri Shrine & Regional Food Relief Trust', location: 'Old Town Heritage Corridor', contact: '+916742430099' }
];

export const SurplusRedistributionPage: React.FC = () => {
  const meals = appStore.getMeals();
  const activeMeal = meals.find(m => m.id === 'meal-2') || meals[0];

  const [selectedNGO, setSelectedNGO] = useState<string>(NGOS[0].id);
  const [checklist, setChecklist] = useState({
    temp: true,
    hygiene: true,
    untouched: true,
    time: true
  });
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const [surplusCalc, setSurplusCalc] = useState(
    appStore.getSurplusCalculation(activeMeal.id)
  );

  useEffect(() => {
    const update = () => setSurplusCalc(appStore.getSurplusCalculation(activeMeal.id));
    return appStore.subscribe(update);
  }, [activeMeal.id]);

  const targetNGO = NGOS.find(n => n.id === selectedNGO) || NGOS[0];
  const allVerified = Object.values(checklist).every(Boolean);

  const handleExecuteDispatch = () => {
    if (!allVerified) return;

    // Execute dispatch in store
    appStore.setPreparedQuantity(activeMeal.id, surplusCalc.preparedQty);
    setDispatchSuccess(true);

    setTimeout(() => {
      setDispatchSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      <div className="border-b border-[#EBE4D8] dark:border-[#2C2724] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5" />
          <span>SURPLUS FOOD REDISTRIBUTION & NGO DISPATCH</span>
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-white mt-1">
          Surplus Food Rescue & Verification Hub
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
          Bhubaneswar, Odisha • Automatic Calculation & Food Safety Verification
        </p>
      </div>

      {/* Top Calculation Summary */}
      <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white/10 dark:bg-black/40 border border-white/10">
            <div className="text-xs font-mono text-slate-500 uppercase">Prepared Food Qty</div>
            <div className="text-2xl font-bold font-mono text-[#2C221E] dark:text-white mt-1">
              {surplusCalc.preparedQty} Portions
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 dark:bg-black/40 border border-white/10">
            <div className="text-xs font-mono text-slate-500 uppercase">Real-Time Attended</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
              {surplusCalc.attendedCount} Students
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#C86D44]/20 border border-[#C86D44]/40">
            <div className="text-xs font-mono font-bold text-[#C86D44] dark:text-amber-300 uppercase">Surplus For Rescue</div>
            <div className="text-2xl font-bold font-mono text-[#C86D44] dark:text-amber-300 mt-1">
              {surplusCalc.surplusQty} Portions
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Step 1: Select Verified NGO Partner */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#2C221E] dark:text-white">
            1. Select Verified NGO Partner
          </h2>

          <div className="space-y-3">
            {NGOS.map((ngo) => (
              <label
                key={ngo.id}
                onClick={() => setSelectedNGO(ngo.id)}
                className={`p-4 rounded-2xl border flex items-start justify-between cursor-pointer transition-all ${
                  selectedNGO === ngo.id
                    ? 'bg-[#C86D44]/20 border-[#C86D44] shadow-md'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs text-[#2C221E] dark:text-amber-100">{ngo.name}</div>
                  <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C86D44]" />
                    <span>{ngo.location}</span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="ngo"
                  checked={selectedNGO === ngo.id}
                  onChange={() => setSelectedNGO(ngo.id)}
                  className="accent-[#C86D44] mt-1 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: 4-Step Food Safety Verification Checklist */}
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#2C221E] dark:text-white">
            2. Food Safety Verification
          </h2>

          <div className="space-y-3">
            {[
              { key: 'temp', label: 'Food Temperature > 60°C maintained in thermal containers' },
              { key: 'hygiene', label: 'Hygienic stainless-steel tray packaging verified' },
              { key: 'untouched', label: '100% untouched food seal certified by mess warden' },
              { key: 'time', label: 'Dispatch time within 2 hours of service closure' },
            ].map((item) => (
              <label
                key={item.key}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition-all text-xs"
              >
                <span className="text-slate-800 dark:text-slate-200 font-medium">{item.label}</span>
                <input
                  type="checkbox"
                  checked={(checklist as any)[item.key]}
                  onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                  className="w-4 h-4 accent-[#C86D44] cursor-pointer"
                />
              </label>
            ))}
          </div>

          {dispatchSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold text-center animate-in zoom-in-95">
              ✅ DISPATCH SUCCESSFUL! {surplusCalc.surplusQty} Surplus Meals dispatched to {targetNGO.name}.
            </div>
          ) : (
            <button
              onClick={handleExecuteDispatch}
              disabled={!allVerified}
              className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                allVerified
                  ? 'bg-[#C86D44] hover:bg-[#B35C33] text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>🚚 DISPATCH SURPLUS FOOD TO NGO</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
