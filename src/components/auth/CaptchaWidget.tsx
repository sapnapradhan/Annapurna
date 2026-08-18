import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CaptchaWidgetProps {
  onVerify: (token: string | null) => void;
}

export const CaptchaWidget: React.FC<CaptchaWidgetProps> = ({ onVerify }) => {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const generateChallenge = () => {
    const n1 = Math.floor(1 + Math.random() * 9);
    const n2 = Math.floor(1 + Math.random() * 9);
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsVerified(false);
    setErrorMsg('');
    onVerify(null);
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const handleChallengeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = num1 + num2;
    if (parseInt(userAnswer.trim(), 10) === expected) {
      setIsVerified(true);
      setErrorMsg('');
      onVerify(`CAPTCHA-VERIFIED-${Date.now()}`);
    } else {
      setIsVerified(false);
      setErrorMsg('Incorrect answer. Please try again.');
      onVerify(null);
    }
  };

  // Turnstile Cloudflare Integration if Site Key exists
  useEffect(() => {
    if (siteKey && window.turnstile) {
      window.turnstile.render('#turnstile-container', {
        sitekey: siteKey,
        callback: (token: string) => {
          setIsVerified(true);
          onVerify(token);
        },
        'error-callback': () => {
          setIsVerified(false);
          setErrorMsg('Cloudflare Turnstile verification failed.');
          onVerify(null);
        }
      });
    }
  }, [siteKey]);

  return (
    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Anti-Bot Verification</span>
        </div>
        {siteKey && <span className="text-[10px] font-mono text-slate-500">Cloudflare Turnstile</span>}
      </div>

      {siteKey ? (
        <div id="turnstile-container" className="flex justify-center py-1" />
      ) : (
        <div className="space-y-2 text-xs">
          {isVerified ? (
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verification Completed</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">HUMAN VERIFIED</span>
            </div>
          ) : (
            <form onSubmit={handleChallengeSubmit} className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 font-mono font-bold text-amber-300 text-sm flex items-center gap-1.5 select-none">
                <span>{num1}</span>
                <span>+</span>
                <span>{num2}</span>
                <span>=</span>
              </div>

              <input
                type="number"
                placeholder="Result?"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                required
              />

              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase"
              >
                Verify
              </button>

              <button
                type="button"
                onClick={generateChallenge}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                title="Refresh Challenge"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {errorMsg && (
            <div className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: string, options: any) => void;
    };
  }
}
