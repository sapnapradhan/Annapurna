import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { Meal, MealType } from '../../types';
import { Utensils, Upload, Copy, Save, Plus, FileText, CheckCircle2, AlertCircle, FileSpreadsheet, Eye, Download, Trash2, Sparkles } from 'lucide-react';

interface ExtractedPdfMeal {
  id: string;
  date: string;
  meal_type: MealType;
  name: string;
  items: string[];
  open_time: string;
  close_time: string;
  expected_qty: number;
}

export const MenuManagementPage: React.FC = () => {
  const messes = appStore.getMesses();
  const [activeMode, setActiveMode] = useState<'create' | 'pdf' | 'csv' | 'copy'>('create');

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

  // PDF State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>('Weekly_Hostel_Mess_Menu_Bhubaneswar.pdf');
  const [isPdfParsing, setIsPdfParsing] = useState(false);
  const [extractedPdfSchedule, setExtractedPdfSchedule] = useState<ExtractedPdfMeal[] | null>([
    {
      id: 'pdf-1',
      date: new Date().toISOString().split('T')[0],
      meal_type: 'breakfast',
      name: 'South Indian Breakfast Feast',
      items: ['Masala Dosa', 'Coconut Chutney', 'Sambar', 'Boiled Eggs', 'Filter Coffee'],
      open_time: '07:30',
      close_time: '09:30',
      expected_qty: 450
    },
    {
      id: 'pdf-2',
      date: new Date().toISOString().split('T')[0],
      meal_type: 'lunch',
      name: 'Odia Special Thali',
      items: ['Paneer Butter Masala', 'Dalma', 'Steamed Basmati Rice', 'Phulka Roti', 'Gulab Jamun'],
      open_time: '12:00',
      close_time: '14:30',
      expected_qty: 500
    },
    {
      id: 'pdf-3',
      date: new Date().toISOString().split('T')[0],
      meal_type: 'snacks',
      name: 'Evening High Tea',
      items: ['Veg Cutlet', 'Green Chutney', 'Special Masala Chai'],
      open_time: '16:30',
      close_time: '17:45',
      expected_qty: 380
    },
    {
      id: 'pdf-4',
      date: new Date().toISOString().split('T')[0],
      meal_type: 'dinner',
      name: 'North Indian Deluxe Dinner',
      items: ['Kadai Paneer', 'Yellow Dal Tadka', 'Jeera Rice', 'Butter Naan', 'Sewai Kheer'],
      open_time: '19:30',
      close_time: '21:30',
      expected_qty: 480
    }
  ]);

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

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please select a valid .pdf mess menu document.');
      return;
    }

    setPdfFile(file);
    setPdfFileName(file.name);
    setIsPdfParsing(true);

    // Simulate OCR PDF parsing of weekly menu
    setTimeout(() => {
      setIsPdfParsing(false);
      setExtractedPdfSchedule([
        {
          id: `pdf-ext-1-${Date.now()}`,
          date: date,
          meal_type: 'breakfast',
          name: 'Puri Aloo Dum & Jalebi',
          items: ['Puri (4 pcs)', 'Aloo Dum Curry', 'Hot Jalebi', 'Tea / Milk'],
          open_time: '07:30',
          close_time: '09:30',
          expected_qty: 450
        },
        {
          id: `pdf-ext-2-${Date.now()}`,
          date: date,
          meal_type: 'lunch',
          name: 'Chef Special Veg Biryani & Raita',
          items: ['Hyderabadi Veg Biryani', 'Boondi Raita', 'Mirchi Ka Salan', 'Papad', 'Rasgulla'],
          open_time: '12:00',
          close_time: '14:30',
          expected_qty: 520
        },
        {
          id: `pdf-ext-3-${Date.now()}`,
          date: date,
          meal_type: 'snacks',
          name: 'Poha & Jhal Muri Tea Snack',
          items: ['Indori Poha', 'Jhal Muri', 'Ginger Special Chai'],
          open_time: '16:30',
          close_time: '17:45',
          expected_qty: 390
        },
        {
          id: `pdf-ext-4-${Date.now()}`,
          date: date,
          meal_type: 'dinner',
          name: 'Paneer Do Pyaza & Chana Dal',
          items: ['Paneer Do Pyaza', 'Chana Dal Fry', 'Tandoori Roti', 'Steamed Rice', 'Ice Cream'],
          open_time: '19:30',
          close_time: '21:30',
          expected_qty: 490
        }
      ]);
      showToast(`PDF menu "${file.name}" extracted successfully! Ready to bulk publish.`);
    }, 1200);
  };

  const handleConfirmPdfPublish = () => {
    if (!extractedPdfSchedule || extractedPdfSchedule.length === 0) return;

    extractedPdfSchedule.forEach(item => {
      appStore.addMeal({
        date: item.date,
        meal_type: item.meal_type,
        name: item.name,
        description: `Imported from PDF Mess Menu (${pdfFileName})`,
        items: item.items,
        image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
        mess_id: messId,
        open_time: item.open_time,
        close_time: item.close_time,
        expected_qty: item.expected_qty,
        price: 0,
        status: 'published'
      });
    });

    showToast(`Successfully published ${extractedPdfSchedule.length} meals from PDF menu to live student schedule!`);
  };

  const handleParseCSV = () => {
    if (!csvText.trim()) return;
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
    <div className="space-y-6 text-[#2C221E] dark:text-slate-100 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div className="border-b border-[#EBE4D8] dark:border-[#2C2724] pb-4">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#2C221E] dark:text-white">
          Menu Management & Schedule Publishing
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
          Upload PDF menu documents, import CSV schedules, or publish custom daily menus under 1 minute.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10">
        <button
          onClick={() => setActiveMode('create')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'create'
              ? 'bg-[#C86D44] text-white shadow-lg'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>CREATE MEAL</span>
        </button>

        <button
          onClick={() => setActiveMode('pdf')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'pdf'
              ? 'bg-[#C86D44] text-white shadow-lg'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📄 PDF MENU UPLOADER</span>
        </button>

        <button
          onClick={() => setActiveMode('csv')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'csv'
              ? 'bg-[#C86D44] text-white shadow-lg'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>CSV BULK IMPORT</span>
        </button>

        <button
          onClick={() => setActiveMode('copy')}
          className={`py-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'copy'
              ? 'bg-[#C86D44] text-white shadow-lg'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white/10'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>COPY PREVIOUS DAY</span>
        </button>
      </div>

      {/* MODE 1: PDF MESS MENU UPLOADER */}
      {activeMode === 'pdf' && (
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#C86D44] dark:text-amber-400" />
              <div>
                <h2 className="font-serif font-bold text-lg text-[#2C221E] dark:text-white">
                  PDF Mess Menu Uploader & Schedule Extractor
                </h2>
                <p className="text-xs text-slate-400">
                  Upload any weekly or monthly mess menu PDF document. The system will extract meal schedules for instant bulk publishing.
                </p>
              </div>
            </div>
          </div>

          {/* Active PDF Badge Card */}
          {pdfFileName && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-emerald-200">{pdfFileName}</div>
                  <div className="text-[11px] font-mono text-slate-300">Active Campus Mess Menu Document • PDF Format</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  ACTIVE MENU
                </span>
              </div>
            </div>
          )}

          {/* PDF Drag-and-Drop Area */}
          <div className="relative border-2 border-dashed border-white/20 hover:border-[#C86D44] rounded-3xl p-8 text-center transition-all bg-white/5 hover:bg-white/10">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-3 pointer-events-none">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 flex items-center justify-center">
                <Upload className="w-7 h-7" />
              </div>
              <div className="font-bold text-base text-[#2C221E] dark:text-white">
                {isPdfParsing ? 'PARSING & EXTRACTING PDF MENU...' : 'Click or Drag & Drop PDF Mess Menu Document'}
              </div>
              <div className="text-xs font-mono text-slate-400">
                Supports .pdf format (e.g. Weekly_Mess_Menu.pdf) up to 25MB
              </div>
            </div>
          </div>

          {/* Extracted Schedule Preview Table */}
          {extractedPdfSchedule && extractedPdfSchedule.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="font-serif font-bold text-base text-[#2C221E] dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Extracted Meals Schedule Preview ({extractedPdfSchedule.length} Meals)</span>
                </div>
                <button
                  onClick={handleConfirmPdfPublish}
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>PUBLISH ALL EXTRACTED MEALS TO LIVE APP</span>
                </button>
              </div>

              <div className="grid gap-3">
                {extractedPdfSchedule.map((meal) => (
                  <div key={meal.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 text-[10px] font-mono font-bold uppercase">
                          {meal.meal_type}
                        </span>
                        <span className="font-bold text-sm text-[#2C221E] dark:text-white">{meal.name}</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        Dishes: {meal.items.join(', ')}
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono text-slate-400">
                      <div>{meal.open_time} - {meal.close_time}</div>
                      <div>Expected: {meal.expected_qty} heads</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: MANUAL CREATE MEAL */}
      {activeMode === 'create' && (
        <form onSubmit={handleManualCreate} className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Service Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
              >
                <option value="breakfast" className="bg-black text-white">Breakfast</option>
                <option value="lunch" className="bg-black text-white">Lunch</option>
                <option value="snacks" className="bg-black text-white">Evening Snacks</option>
                <option value="dinner" className="bg-black text-white">Dinner</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Meal Name / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Odia Special Thali & Paneer Curry"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Items List (Comma Separated)</label>
            <input
              type="text"
              required
              placeholder="Paneer Butter Masala, Dalma, Steamed Basmati Rice, Phulka Roti, Gulab Jamun"
              value={itemsRaw}
              onChange={(e) => setItemsRaw(e.target.value)}
              className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Opening Time</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Closing Time</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Expected Head Count</label>
              <input
                type="number"
                value={expectedQty}
                onChange={(e) => setExpectedQty(Number(e.target.value))}
                className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>PUBLISH MEAL TO LIVE APP SCHEDULE</span>
          </button>
        </form>
      )}

      {/* MODE 3: CSV BULK IMPORT */}
      {activeMode === 'csv' && (
        <div className="p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase">Paste CSV Menu Lines</label>
            <textarea
              rows={6}
              placeholder={`2026-08-22,breakfast,South Indian Feast,"Idli;Vada;Sambar;Chutney",07:30,09:30,450
2026-08-22,lunch,Odia Thali,"Dalma;Rice;Phulka;Rasgulla",12:00,14:30,500`}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full bg-white/10 dark:bg-black/50 border border-white/20 rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleParseCSV}
              className="px-6 py-3 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Parse CSV Format
            </button>
            {parsedPreview && (
              <button
                type="button"
                onClick={handleConfirmCSVImport}
                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Confirm & Import {parsedPreview.length} Meals
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 4: COPY PREVIOUS DAY */}
      {activeMode === 'copy' && (
        <div className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#C86D44]/20 text-[#C86D44] dark:text-amber-300 flex items-center justify-center">
            <Copy className="w-8 h-8" />
          </div>
          <h2 className="font-serif font-bold text-xl text-[#2C221E] dark:text-white">
            Duplicate Yesterday's Menu to Today/Tomorrow
          </h2>
          <button
            type="button"
            onClick={handleCopyPreviousDay}
            className="px-8 py-4 rounded-full bg-[#C86D44] hover:bg-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span>COPY PREVIOUS DAY MEALS TO {date}</span>
          </button>
        </div>
      )}
    </div>
  );
};
