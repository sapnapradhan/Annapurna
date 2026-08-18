import React, { useState } from 'react';
import { appStore } from '../../services/store';
import { QuantityFeedback } from '../../types';
import { Star, X, CheckCircle2, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentReviewModalProps {
  mealId: string;
  mealName: string;
  onClose: () => void;
}

export const StudentReviewModal: React.FC<StudentReviewModalProps> = ({
  mealId,
  mealName,
  onClose
}) => {
  const [stars, setStars] = useState(5);
  const [quantityFeedback, setQuantityFeedback] = useState<QuantityFeedback>('just_right');
  const [tasteRating, setTasteRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [temperatureRating, setTemperatureRating] = useState(4);
  const [varietyRating, setVarietyRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.submitReview({
      meal_id: mealId,
      stars,
      quantity_feedback: quantityFeedback,
      taste_rating: tasteRating,
      quality_rating: qualityRating,
      temperature_rating: temperatureRating,
      variety_rating: varietyRating,
      comment
    });

    confetti({ particleCount: 50, spread: 60 });
    setSubmitted(true);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-serif font-bold text-lg text-emerald-300">Thank You For Your Feedback!</h3>
            <p className="text-xs text-slate-400">Your evaluation directly helps mess authorities calibrate meal quantities and taste quality.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">Post Meal Evaluation</div>
              <h3 className="font-serif font-bold text-base text-slate-100">{mealName}</h3>
            </div>

            {/* Overall Star Rating */}
            <div className="text-center py-2 space-y-1">
              <div className="text-xs text-slate-400">Overall Rating</div>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStars(s)}
                    className="p-1 focus:outline-none transform hover:scale-125 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Feedback Pills */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium block">Portion Quantity Feedback</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'too_little', label: 'Too Little' },
                  { id: 'just_right', label: 'Just Right' },
                  { id: 'too_much', label: 'Too Much' }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setQuantityFeedback(p.id as QuantityFeedback)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all ${quantityFeedback === p.id ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro Attribute Ratings */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block mb-1">Taste Score ({tasteRating}/5)</span>
                <input
                  type="range" min="1" max="5" value={tasteRating}
                  onChange={(e) => setTasteRating(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Temperature ({temperatureRating}/5)</span>
                <input
                  type="range" min="1" max="5" value={temperatureRating}
                  onChange={(e) => setTemperatureRating(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>

            {/* Comment Box */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Optional Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share thoughts on taste, fresh items, or temperature..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Submit Meal Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
