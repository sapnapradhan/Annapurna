import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Surplus } from '../../types';
import { Truck, ShieldCheck, CheckCircle2, AlertTriangle, Plus, MapPin, Clock, ArrowRight } from 'lucide-react';

export const SurplusRedistributionPage: React.FC = () => {
  const [surplusList, setSurplusList] = useState<Surplus[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState(40);
  const [temperature, setTemperature] = useState('Hot (>65°C)');
  const [storageCondition, setStorageCondition] = useState('Insulated Stainless Containers');
  const [packaging, setPackaging] = useState('Sealed Bulk Trays');
  const [pickupDeadline, setPickupDeadline] = useState(new Date(Date.now() + 14400000).toISOString().slice(0, 16));
  const [location, setLocation] = useState('Main Mess Gate 2 Dispatch Bay');

  useEffect(() => {
    const update = () => setSurplusList(appStore.getSurplus());
    update();
    return appStore.subscribe(update);
  }, []);

  const handleDeclare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!food) return;

    appStore.declareSurplus({
      meal_id: 'meal-1',
      food,
      quantity,
      prep_time: new Date().toISOString(),
      temperature,
      storage_condition: storageCondition,
      packaging,
      pickup_deadline: new Date(pickupDeadline).toISOString(),
      location
    });

    setModalOpen(false);
    setFood('');
    setToast('Surplus food batch declared successfully!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleVerifySafety = (id: string) => {
    appStore.updateSurplusStatus(id, { safety_verified: true });
    setToast('Food safety protocol verified & signed!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleMatchRecipient = (id: string) => {
    appStore.updateSurplusStatus(id, { matched_recipient: 'Robin Hood Army (Shelter 4)' });
    setToast('Matched with verified NGO recipient!');
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirmPickup = (id: string) => {
    appStore.updateSurplusStatus(id, { pickup_confirmed: true });
    setToast('Pickup confirmed! Dispatch receipt generated.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Surplus Rescue & NGO Redistribution</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            4-step workflow: Declare Surplus → Verify Safety Checklist → Match Eligible NGO → Confirm Pickup.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Declare Surplus Batch</span>
        </button>
      </div>

      {/* Workflow Progress Legend */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono flex items-center justify-center text-xs">1</span>
          <span className="text-slate-300 font-semibold">Declare Surplus</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono flex items-center justify-center text-xs">2</span>
          <span className="text-slate-300 font-semibold">Verify Safety</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono flex items-center justify-center text-xs">3</span>
          <span className="text-slate-300 font-semibold">Match NGO</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold font-mono flex items-center justify-center text-xs">4</span>
          <span className="text-emerald-300 font-semibold">Confirm Pickup</span>
        </div>
      </div>

      {/* Surplus Batch List */}
      <div className="space-y-4">
        {surplusList.map((item) => (
          <div key={item.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-100">{item.food}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5 font-mono">
                  <span>Quantity: <strong className="text-amber-300">{item.quantity} portions</strong></span>
                  <span>Temp: <strong className="text-slate-200">{item.temperature}</strong></span>
                  <span>Packaging: <strong className="text-slate-200">{item.packaging}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Deadline: {new Date(item.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Step Action Pipeline */}
            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              {/* Step 2: Safety */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400">Step 2: Food Safety Checklist</div>
                {item.safety_verified ? (
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Safety Standard Verified</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerifySafety(item.id)}
                    className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Verify Safety Checklist
                  </button>
                )}
              </div>

              {/* Step 3: Match Recipient */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400">Step 3: NGO Partner Match</div>
                {item.matched_recipient ? (
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{item.matched_recipient}</span>
                  </div>
                ) : (
                  <button
                    disabled={!item.safety_verified}
                    onClick={() => handleMatchRecipient(item.id)}
                    className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-40 text-amber-300 border border-amber-500/30 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Match NGO Recipient
                  </button>
                )}
              </div>

              {/* Step 4: Confirm Pickup */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400">Step 4: Dispatch Confirmation</div>
                {item.pickup_confirmed ? (
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Food Rescued & Dispatched</span>
                  </div>
                ) : (
                  <button
                    disabled={!item.matched_recipient}
                    onClick={() => handleConfirmPickup(item.id)}
                    className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Confirm Dispatch Pickup
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Declare Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleDeclare} className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-100">Declare Surplus Food Batch</h3>
            
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Surplus Description</label>
              <input
                type="text"
                placeholder="e.g. Idli & Sambhar (Untouched Bulk Trays)"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Portion Count</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Temperature</label>
                <input
                  type="text"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Pickup Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Publish Surplus Batch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
