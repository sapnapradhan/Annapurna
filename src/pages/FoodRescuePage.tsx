import React, { useState } from 'react';
import { 
  Truck, ShieldCheck, MapPin, Phone, Clock, ArrowLeft, Heart, CheckCircle2, AlertCircle, Building2, Package, Sparkles
} from 'lucide-react';
import { appStore } from '../services/store';

interface FoodRescuePageProps {
  onBackToHome: () => void;
}

const PARTNER_NGOS = [
  {
    id: 'ngo-1',
    name: 'Robin Hood Army — Bhubaneswar Chapter',
    phone: '+91 94370 12345',
    vehicle: 'Refrigerated Rescue Van (OD-02-AX-4921)',
    driver: 'Rakesh Rout (Verified)',
    eta: '18 mins',
    impactServed: '14,200+ meals',
    status: 'ACTIVE ON CALL'
  },
  {
    id: 'ngo-2',
    name: 'Feeding India by Zomato — Odisha North',
    phone: '+91 98610 98765',
    vehicle: 'Insulated Food Dispatcher (OD-02-BZ-8812)',
    driver: 'Sujit Pattnaik (Verified)',
    eta: '25 mins',
    impactServed: '28,900+ meals',
    status: 'READY FOR DISPATCH'
  },
  {
    id: 'ngo-3',
    name: 'Annamrita Foundation Odisha',
    phone: '+91 97760 54321',
    vehicle: 'Food Safe Carrier (OD-02-CC-1109)',
    driver: 'Manas Swain (Verified)',
    eta: '30 mins',
    impactServed: '52,000+ meals',
    status: 'AVAILABLE'
  }
];

export const FoodRescuePage: React.FC<FoodRescuePageProps> = ({ onBackToHome }) => {
  const [selectedNgo, setSelectedNgo] = useState(PARTNER_NGOS[0]);
  const [rescueQuantity, setRescueQuantity] = useState('35');
  const [mealType, setMealType] = useState('Lunch (Dal, Rice, Paneer Curry)');
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'dispatched'>('idle');
  const [pickupCode, setPickupCode] = useState('');

  const handleTriggerDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `RESCUE-${Math.floor(100000 + Math.random() * 900000)}`;
    setPickupCode(code);
    setDispatchStatus('dispatched');
  };

  return (
    <div className="min-h-screen bg-provided-image text-[#2C221E] dark:text-slate-100 font-sans p-4 sm:p-8 space-y-8">
      {/* Top Header Navigation */}
      <header className="max-w-6xl mx-auto flex items-center justify-between p-4 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl backdrop-blur-xl">
        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-full bg-white/10 dark:bg-black/40 hover:bg-white/20 text-[#2C221E] dark:text-slate-200 text-xs font-bold font-mono transition-colors flex items-center gap-2 cursor-pointer border border-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOMEPAGE</span>
        </button>

        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="ANNAPURNA Logo" 
            className="h-9 w-auto object-contain shrink-0" 
          />
          <div>
            <div className="font-cursive font-bold text-lg text-[#2C221E] dark:text-amber-100">Annapurna Rescue Hub</div>
            <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold">BHUBANESWAR NGO NETWORK</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Left 2-Cols: Dispatch Form & Verification */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Truck className="w-6 h-6 text-[#C86D44] dark:text-amber-400" />
              <h1 className="font-serif font-bold text-2xl text-[#2C221E] dark:text-white">
                Dispatch Surplus Food Rescue
              </h1>
            </div>

            {dispatchStatus === 'dispatched' ? (
              <div className="p-6 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="font-serif font-bold text-xl text-emerald-200">
                  Surplus Food Rescue Dispatched!
                </h2>
                <p className="text-xs text-slate-200 font-medium max-w-md mx-auto">
                  {selectedNgo.name} rescue vehicle <span className="font-mono font-bold text-amber-300">{selectedNgo.vehicle}</span> is en route. ETA: {selectedNgo.eta}.
                </p>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 inline-block font-mono text-sm space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">DRIVER VERIFICATION CODE</div>
                  <div className="text-2xl font-bold text-amber-300 tracking-widest">{pickupCode}</div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setDispatchStatus('idle')}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                  >
                    Dispatch Another Rescue Batch
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTriggerDispatch} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Select Verified NGO Rescue Partner
                  </label>
                  <div className="grid gap-3">
                    {PARTNER_NGOS.map((ngo) => (
                      <div
                        key={ngo.id}
                        onClick={() => setSelectedNgo(ngo)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          selectedNgo.id === ngo.id
                            ? 'bg-[#C86D44]/20 border-[#C86D44] dark:border-amber-400'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-sm text-[#2C221E] dark:text-white">{ngo.name}</div>
                          <div className="text-xs font-mono text-slate-400">{ngo.vehicle} • {ngo.driver}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                            ETA {ngo.eta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Surplus Quantity (Kg / Trays)
                    </label>
                    <input
                      type="text"
                      required
                      value={rescueQuantity}
                      onChange={(e) => setRescueQuantity(e.target.value)}
                      className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#C86D44]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Meal Type & Description
                    </label>
                    <input
                      type="text"
                      required
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-[#C86D44]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>CONFIRM & DISPATCH RESCUE DRIVER</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right 1-Col: Live Telemetry & NGO Contact */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-serif font-bold text-lg text-[#2C221E] dark:text-white">
                Food Safety Guarantee
              </h2>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Thermal Insulated Containers & Temp Logged (&gt;65°C)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Verified FSSAI Food Safety Handler Certification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Under-45-minute guaranteed delivery to local shelters</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-4 backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="font-serif font-bold text-lg text-[#2C221E] dark:text-white">
                Bhubaneswar Rescue Impact
              </h2>
            </div>
            <div className="text-center space-y-1">
              <div className="font-serif font-bold text-4xl text-amber-300">95,100+</div>
              <div className="text-xs font-mono text-slate-300 uppercase">Total Meals Rescued in Odisha</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
