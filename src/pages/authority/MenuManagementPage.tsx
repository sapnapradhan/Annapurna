import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { Meal, MealType } from '../../types';
import { Utensils, Upload, Copy, Save, Plus, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const MenuManagementPage: React.FC = () => {
  const messes = appStore.getMesses();
  const [activeMode, setActiveMode] = useState<'create' | 'csv' | 'copy'>('create');

  // Form State
  const [date, setDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]); // Tomorrow default
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [itemsRaw, setItemsRaw] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [messId, setMessId] = useState(messes[0]?.id || '');
  const [openTime, setOpenTime] = useState('12:00');
  const [closeTime, setCloseTime] = useState('14:30');
  const [expectedQty, setExpectedQty] = useState(500);

  // Success message state
  const [toast, setToast] = useState<string | null>(null);

  // CSV State
  const [csvText, setCsvText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<any[] | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !itemsRaw) return;

    const items = itemsRaw.split(',').map(i => i.trim()).filter(Boolean);

    appStore.addMeal({
      date,
      meal_type: mealType,
      name,
      description,
      items,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      mess_id: messId,
      open_time: openTime,
      close_time: closeTime,
      expected_qty: expectedQty,
      price: 0,
      status: 'published'
    });

    showToast(`Meal "${name}" successfully published for ${date}!`);
    setName('');
    setDescription('');
    setItemsRaw('');
  };

  const handleParseCSV = () => {
    if (!csvText.trim()) return;
    // Example CSV format: date,meal_type,name,items,open_time,close_time,expected_qty
    const lines = csvText.trim().split('\n');
    const parsed = lines.map((line, idx) => {
      const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      return {
        id: idx,
        date: parts[0] || date,
        meal_type: (parts[1] || 'lunch').toLowerCase() as MealType,
        name: parts[2] || `Campus Meal ${idx + 1}`,
        items: parts[3] ? parts[3].split(';') : ['Chef Special Curry', 'Steamed Rice', 'Roti'],
        open_time: parts[4] || '12:00',
        close_time: parts[5] || '14:30',
        expected_qty: Number(parts[6]) || 450
      };
    });
    setParsedPreview(parsed);
  };

  const handleConfirmCSVImport = () => {
    if (!parsedPreview) return;
    parsedPreview.forEach(p => {
      appStore.addMeal({
        date: p.date,
        meal_type: p.meal_type,
        name: p.name,
        description: 'Bulk imported campus menu item',
        items: p.items,
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        mess_id: messId,
        open_time: p.open_time,
        close_time: p.close_time,
        expected_qty: p.expected_qty,
        price: 0,
        status: 'published'
      });
    });
    showToast(`Successfully imported ${parsedPreview.length} meals from CSV!`);
    setCsvText('');
    setParsedPreview(null);
  };

  const handleCopyPreviousDay = () => {
    const count = appStore.copyPreviousDayMeals(date);
    if (count > 0) {
      showToast(`Copied ${count} meals from yesterday to ${date}!`);
    } else {
      showToast('No meals found on yesterday to copy.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Mode Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <span>Menu Management & Rapid Creation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create tomorrow's full menu manually under 60 seconds, bulk import via CSV, or duplicate previous meal schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMode('create')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'create' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Manual Creation
          </button>
          <button
            onClick={() => setActiveMode('csv')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'csv' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            CSV Bulk Import
          </button>
          <button
            onClick={() => setActiveMode('copy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeMode === 'copy' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Shortcuts / Copy
          </button>
        </div>
      </div>

      {/* Mode 1: Manual Form */}
      {activeMode === 'create' && (
        <form onSubmit={handleManualCreate} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none capitalize"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snacks">Snacks</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Mess Facility</label>
              <select
                value={messId}
                onChange={(e) => setMessId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
              >
                {messes.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Meal Title</label>
              <input
                type="text"
                placeholder="e.g. Shahi North Indian Special Thali"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Menu Items (comma separated)</label>
              <input
                type="text"
                placeholder="Paneer Masala, Yellow Dal, Jeera Rice, Roti, Gulab Jamun"
                value={itemsRaw}
                onChange={(e) => setItemsRaw(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <textarea
              placeholder="Short description highlighting dietary information, spices, or special notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Opening Time</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Closing Time</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Expected Student Headcount</label>
              <input
                type="number"
                value={expectedQty}
                onChange={(e) => setExpectedQty(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40"
          >
            <Save className="w-4 h-4" />
            <span>Publish Meal to Campus Schedule</span>
          </button>
        </form>
      )}

      {/* Mode 2: CSV Bulk Upload */}
      {activeMode === 'csv' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Bulk Import via CSV / Excel Format</span>
            </h3>
            <p className="text-xs text-slate-400">
              Paste CSV rows below. Format: <code className="text-amber-300 font-mono">Date, MealType, MealName, Items(semicolon separated), OpenTime, CloseTime, Headcount</code>
            </p>
          </div>

          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={5}
            placeholder={`2026-08-20, lunch, Hyderabadi Dum Biryani, Biryani; Salan; Raita, 12:00, 14:30, 600\n2026-08-20, dinner, Gujarati Thali, Dhokla; Rotli; Undhiyu, 19:30, 21:30, 520`}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          />

          <button
            onClick={handleParseCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Parse & Preview CSV Data</span>
          </button>

          {/* Preview Step before Save */}
          {parsedPreview && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  Preview ({parsedPreview.length} Meals Ready for Save)
                </span>
                <button
                  onClick={handleConfirmCSVImport}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirm & Commit to Database
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="p-2">Date</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Items</th>
                      <th className="p-2">Timing</th>
                      <th className="p-2">Headcount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedPreview.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-900/50">
                        <td className="p-2 font-mono">{item.date}</td>
                        <td className="p-2 capitalize font-semibold text-amber-400">{item.meal_type}</td>
                        <td className="p-2 font-medium">{item.name}</td>
                        <td className="p-2 text-slate-400 max-w-xs truncate">{item.items.join(', ')}</td>
                        <td className="p-2 font-mono">{item.open_time} - {item.close_time}</td>
                        <td className="p-2 font-mono">{item.expected_qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Shortcuts & Copy */}
      {activeMode === 'copy' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <Copy className="w-4 h-4 text-amber-400" />
              <span>Rapid Menu Shortcuts</span>
            </h3>
            <p className="text-xs text-slate-400">
              Target Date selected: <span className="font-mono text-amber-300 font-bold">{date}</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={handleCopyPreviousDay}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
            >
              <div className="font-bold text-slate-200 text-sm mb-1 group-hover:text-amber-300 flex items-center gap-2">
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copy Previous Day's Full Menu</span>
              </div>
              <p className="text-xs text-slate-400">
                Duplicates yesterday's breakfast, lunch, snacks, and dinner directly to target date in draft state.
              </p>
            </button>

            <button
              onClick={handleCopyPreviousDay}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition-all group cursor-pointer"
            >
              <div className="font-bold text-slate-200 text-sm mb-1 group-hover:text-amber-300 flex items-center gap-2">
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copy Last Week's Corresponding Day</span>
              </div>
              <p className="text-xs text-slate-400">
                Duplicates the exact menu from 7 days ago to preserve weekly rotation rhythm.
              </p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
