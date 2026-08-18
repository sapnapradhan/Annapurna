import React, { useState, useEffect } from 'react';
import { appStore } from '../../services/store';
import { Review } from '../../types';
import { Star, Trash2, Edit2, MessageSquare, CheckCircle2 } from 'lucide-react';

export const StudentMyReviewsPage: React.FC = () => {
  const user = appStore.getCurrentUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editStars, setEditStars] = useState(5);

  useEffect(() => {
    const update = () => setReviews(appStore.getStudentReviews(user.id));
    update();
    return appStore.subscribe(update);
  }, [user.id]);

  const handleDelete = (id: string) => {
    appStore.deleteReview(id);
  };

  const handleStartEdit = (rev: Review) => {
    setEditingId(rev.id);
    setEditComment(rev.comment || '');
    setEditStars(rev.stars);
  };

  const handleSaveEdit = (rev: Review) => {
    appStore.submitReview({
      meal_id: rev.meal_id,
      stars: editStars,
      quantity_feedback: rev.quantity_feedback,
      taste_rating: rev.taste_rating,
      quality_rating: rev.quality_rating,
      temperature_rating: rev.temperature_rating,
      variety_rating: rev.variety_rating,
      comment: editComment
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-400" />
          <span>My Submitted Reviews</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage, update, or remove your post-meal ratings and feedback comments.</p>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-900 rounded-2xl">
            You haven't submitted any meal reviews yet. Check in to a meal to leave feedback!
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300">{rev.meal_name}</span>
                <div className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                  <span>{rev.stars} / 5</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
              </div>

              {editingId === rev.id ? (
                <div className="space-y-2 pt-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setEditStars(s)}>
                        <Star className={`w-5 h-5 ${s <= editStars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 text-xs">
                    <button onClick={() => setEditingId(null)} className="px-3 py-1 text-slate-400">Cancel</button>
                    <button onClick={() => handleSaveEdit(rev)} className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg">Save</button>
                  </div>
                </div>
              ) : (
                <>
                  {rev.comment && (
                    <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      "{rev.comment}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-800/60">
                    <span>Submitted {new Date(rev.created_at).toLocaleDateString()}</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleStartEdit(rev)} className="hover:text-amber-300 text-slate-400 flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => handleDelete(rev.id)} className="hover:text-rose-400 text-slate-400 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
