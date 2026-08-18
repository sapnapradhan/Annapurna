import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Review } from '../../types';
import { Star, Filter, MessageSquare, Flame, ThumbsUp, Sparkles } from 'lucide-react';

export const FeedbackDashboardPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);

  useEffect(() => {
    const update = () => setReviews(appStore.getReviews());
    update();
    return appStore.subscribe(update);
  }, []);

  const filtered = reviews.filter(r => r.stars >= minRatingFilter);

  // Compute Averages
  const total = filtered.length || 1;
  const avgOverall = (filtered.reduce((acc, r) => acc + r.stars, 0) / total).toFixed(1);
  const avgTaste = (filtered.reduce((acc, r) => acc + r.taste_rating, 0) / total).toFixed(1);
  const avgQuality = (filtered.reduce((acc, r) => acc + r.quality_rating, 0) / total).toFixed(1);
  const avgTemp = (filtered.reduce((acc, r) => acc + r.temperature_rating, 0) / total).toFixed(1);
  const avgVariety = (filtered.reduce((acc, r) => acc + r.variety_rating, 0) / total).toFixed(1);

  // Per menu item rollups
  const itemRollups = [
    { item: 'Ghee Masala Dosa', rating: '4.8', count: 42 },
    { item: 'Paneer Butter Masala', rating: '4.6', count: 68 },
    { item: 'Yellow Dal Tadka', rating: '4.3', count: 54 },
    { item: 'Punjabi Samosa', rating: '4.7', count: 39 },
    { item: 'Veg Dum Biryani', rating: '4.5', count: 81 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span>Meal Feedback & Quality Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-attribute student evaluation rollup. Analyze taste, food temperature, portions, and dish performance rollups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={minRatingFilter}
            onChange={(e) => setMinRatingFilter(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-amber-200 focus:outline-none font-medium"
          >
            <option value={0}>All Ratings (1–5 Stars)</option>
            <option value={4}>4+ Stars Only</option>
            <option value={5}>5 Star Ratings</option>
          </select>
        </div>
      </div>

      {/* Attribute Ratings Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 text-center">
          <div className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">Overall Rating</div>
          <div className="text-3xl font-bold font-mono text-amber-400">{avgOverall} / 5</div>
          <div className="flex justify-center gap-0.5 text-amber-400 mt-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(Number(avgOverall)) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Taste Score</div>
          <div className="text-2xl font-bold font-mono text-slate-100">{avgTaste}</div>
          <div className="text-[10px] text-slate-500 mt-1">Flavor Balance</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Quality Score</div>
          <div className="text-2xl font-bold font-mono text-slate-100">{avgQuality}</div>
          <div className="text-[10px] text-slate-500 mt-1">Ingredient Freshness</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Temperature</div>
          <div className="text-2xl font-bold font-mono text-slate-100">{avgTemp}</div>
          <div className="text-[10px] text-slate-500 mt-1">Thermal Retention</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-1">Variety Score</div>
          <div className="text-2xl font-bold font-mono text-slate-100">{avgVariety}</div>
          <div className="text-[10px] text-slate-500 mt-1">Menu Diversity</div>
        </div>
      </div>

      {/* Per Menu Item Rollups */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Per Menu Item Rating Rollups</span>
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {itemRollups.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200 text-xs">{item.item}</div>
                <div className="text-[10px] text-slate-500">{item.count} student evaluations</div>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Reviews Feed */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Recent Student Feedback Logs</span>
        </h3>

        <div className="space-y-3">
          {filtered.map((rev) => (
            <div key={rev.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{rev.student_name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400 font-semibold">{rev.meal_name}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                  <span>{rev.stars} / 5</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
              </div>

              {rev.comment && (
                <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  "{rev.comment}"
                </p>
              )}

              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Portions: <strong className="text-slate-200 capitalize">{rev.quantity_feedback.replace('_', ' ')}</strong></span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Taste: <strong className="text-amber-300">{rev.taste_rating}/5</strong></span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">Temp: <strong className="text-amber-300">{rev.temperature_rating}/5</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
