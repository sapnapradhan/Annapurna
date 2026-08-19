import React, { useMemo } from 'react';

export const DynamicParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // 2px to 6px
      left: Math.random() * 95, // 0% to 95%
      top: Math.random() * 95,
      delay: Math.random() * 5, // 0s to 5s delay
      duration: Math.random() * 6 + 6, // 6s to 12s duration
      color: i % 2 === 0 ? 'bg-[#C86D44]' : 'bg-amber-400',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full blur-[1px] ${p.color} opacity-40 animate-float-particle`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
