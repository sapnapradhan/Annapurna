import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { ArrowRight, Sparkles, Utensils, Heart } from 'lucide-react';

export interface ColorScheme {
  gradient: [string, string, string];
  textColor: string;
  shadowColor: string;
  glowColor: string;
}

const LOGO_PALETTES: ColorScheme[] = [
  {
    gradient: ['#FF9EBB', '#C86D44', '#8C3518'], // Terracotta Gold
    textColor: '#FFFDF0',
    shadowColor: 'rgba(200, 109, 68, 0.8)',
    glowColor: '#FFB088'
  },
  {
    gradient: ['#FFE082', '#D48C46', '#7F4510'], // Amber Honey
    textColor: '#FFFFFF',
    shadowColor: 'rgba(212, 140, 70, 0.8)',
    glowColor: '#FFE599'
  },
  {
    gradient: ['#A6F6FF', '#00D2FF', '#0070B8'], // Cyan Sky
    textColor: '#FFFFFF',
    shadowColor: 'rgba(0, 210, 255, 0.8)',
    glowColor: '#80E5FF'
  },
  {
    gradient: ['#F39EFF', '#B5179E', '#5B0060'], // Berry Violet
    textColor: '#FFFFFF',
    shadowColor: 'rgba(181, 23, 158, 0.8)',
    glowColor: '#E566FF'
  },
  {
    gradient: ['#A0FFE6', '#00F5D4', '#008770'], // Mint Fresh
    textColor: '#FFFFFF',
    shadowColor: 'rgba(0, 245, 212, 0.8)',
    glowColor: '#66FFE8'
  }
];

const LOGO_ITEMS = [
  { text: 'A', isLetter: true },
  { text: 'N', isLetter: true },
  { text: 'N', isLetter: true },
  { text: 'A', isLetter: true },
  { text: 'P', isLetter: true },
  { text: 'U', isLetter: true },
  { text: 'R', isLetter: true },
  { text: 'N', isLetter: true },
  { text: 'A', isLetter: true },
  { text: 'NOURISH', isLetter: false },
  { text: 'RESCUE', isLetter: false },
  { text: 'SHARE', isLetter: false }
];

interface LetterObject {
  id: string;
  text: string;
  body: Matter.Body;
  width: number;
  height: number;
  fontSize: number;
  palette: ColorScheme;
  isLetter: boolean;
  squashX: number;
  squashY: number;
  targetSquashX: number;
  targetSquashY: number;
}

interface AnnapurnaGravityLogoIntroProps {
  onEnterPlatform: () => void;
}

export const AnnapurnaGravityLogoIntro: React.FC<AnnapurnaGravityLogoIntroProps> = ({ onEnterPlatform }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const lettersRef = useRef<LetterObject[]>([]);
  const boundariesRef = useRef<Matter.Body[]>([]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.25, scale: 0.001 }
    });
    engineRef.current = engine;

    const wallThickness = 200;
    const ground = Matter.Bodies.rectangle(
      width / 2,
      height + wallThickness / 2 - 10,
      width * 2,
      wallThickness,
      { isStatic: true, restitution: 0.75, friction: 0.05 }
    );

    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2 + 10,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, restitution: 0.7, friction: 0.05 }
    );

    const rightWall = Matter.Bodies.rectangle(
      width + wallThickness / 2 - 10,
      height / 2,
      wallThickness,
      height * 2,
      { isStatic: true, restitution: 0.7, friction: 0.05 }
    );

    boundariesRef.current = [ground, leftWall, rightWall];
    Matter.Composite.add(engine.world, boundariesRef.current);

    const ctx = canvas.getContext('2d');

    const spawnLetter = (index: number) => {
      const itemConfig = LOGO_ITEMS[index % LOGO_ITEMS.length];
      const isLetter = itemConfig.isLetter;

      const baseFontSize = isLetter
        ? Math.min(width * 0.12, 110)
        : Math.min(width * 0.045, 36);

      const letterWidth = isLetter ? baseFontSize * 0.85 : baseFontSize * (itemConfig.text.length * 0.65);
      const letterHeight = baseFontSize * 1.1;

      const spawnX = (width / (LOGO_ITEMS.length + 1)) * (index + 1) + (Math.random() - 0.5) * 40;
      const spawnY = -120 - index * 60;

      const body = Matter.Bodies.rectangle(spawnX, spawnY, letterWidth, letterHeight, {
        restitution: 0.72,
        friction: 0.02,
        frictionAir: 0.015,
        density: 0.002,
        angle: (Math.random() - 0.5) * 0.5
      });

      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
      Matter.Composite.add(engine.world, body);

      const palette = LOGO_PALETTES[index % LOGO_PALETTES.length];

      const letterObj: LetterObject = {
        id: `letter-${index}-${Date.now()}`,
        text: itemConfig.text,
        body,
        width: letterWidth,
        height: letterHeight,
        fontSize: baseFontSize,
        palette,
        isLetter,
        squashX: 1,
        squashY: 1,
        targetSquashX: 1,
        targetSquashY: 1
      };

      lettersRef.current.push(letterObj);
    };

    LOGO_ITEMS.forEach((_, idx) => {
      setTimeout(() => {
        spawnLetter(idx);
      }, idx * 260);
    });

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        lettersRef.current.forEach((item) => {
          if (item.body === bodyA || item.body === bodyB) {
            const speed = Math.sqrt(
              item.body.velocity.x * item.body.velocity.x +
              item.body.velocity.y * item.body.velocity.y
            );
            if (speed > 1.5) {
              item.targetSquashX = 1 + Math.min(speed * 0.04, 0.35);
              item.targetSquashY = 1 - Math.min(speed * 0.04, 0.35);
              setTimeout(() => {
                item.targetSquashX = 1;
                item.targetSquashY = 1;
              }, 120);
            }
          }
        });
      });
    });

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    let animationFrameId: number;
    const renderLoop = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      lettersRef.current.forEach((item) => {
        item.squashX += (item.targetSquashX - item.squashX) * 0.2;
        item.squashY += (item.targetSquashY - item.squashY) * 0.2;

        const pos = item.body.position;
        const angle = item.body.angle;

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        ctx.scale(item.squashX, item.squashY);

        ctx.shadowColor = item.palette.shadowColor;
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;

        const radius = Math.min(item.width, item.height) * 0.35;
        ctx.beginPath();
        if ((ctx as any).roundRect) {
          (ctx as any).roundRect(
            -item.width / 2,
            -item.height / 2,
            item.width,
            item.height,
            radius
          );
        } else {
          ctx.rect(-item.width / 2, -item.height / 2, item.width, item.height);
        }

        const grad = ctx.createLinearGradient(0, -item.height / 2, 0, item.height / 2);
        grad.addColorStop(0, item.palette.gradient[0]);
        grad.addColorStop(0.5, item.palette.gradient[1]);
        grad.addColorStop(1, item.palette.gradient[2]);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 3.5;
        ctx.strokeStyle = item.palette.glowColor;
        ctx.stroke();

        ctx.shadowColor = 'transparent';

        ctx.font = `900 ${item.fontSize}px 'Titan One', 'Fredoka', cursive, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = 6;
        ctx.strokeStyle = '#2A0E06';
        ctx.strokeText(item.text, 0, 2);

        ctx.fillStyle = item.palette.textColor;
        ctx.fillText(item.text, 0, 0);

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      width = containerRef.current.clientWidth || window.innerWidth;
      height = containerRef.current.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      if (boundariesRef.current[0]) {
        Matter.Body.setPosition(boundariesRef.current[0], { x: width / 2, y: height + wallThickness / 2 - 10 });
      }
      if (boundariesRef.current[2]) {
        Matter.Body.setPosition(boundariesRef.current[2], { x: width + wallThickness / 2 - 10, y: height / 2 });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.World.clear(engineRef.current.world, false);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    lettersRef.current.forEach((itemObj) => {
      const { body } = itemObj;
      const dx = body.position.x - px;
      const dy = body.position.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180 && dist > 0) {
        const influence = (1 - dist / 180);
        const directionX = dx / dist;

        const forceX = directionX * influence * 0.1;
        const forceY = -influence * 0.025;

        Matter.Body.applyImpulse(body, body.position, { x: forceX, y: forceY });
        Matter.Body.setAngularVelocity(body, body.angularVelocity + directionX * influence * 0.14);
      }
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    lettersRef.current.forEach((itemObj) => {
      const { body } = itemObj;
      const dx = body.position.x - px;
      const dy = body.position.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 240) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - dist / 240) * 0.28;
        Matter.Body.applyImpulse(body, body.position, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force - 0.06
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.35);
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#090807] select-none font-sans text-white"
    >
      {/* 2D Physics Canvas Layer */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onClick={handleCanvasClick}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Official Website Logo Photo Header Badge */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none animate-in fade-in zoom-in-95 duration-500">
        <div className="p-4 rounded-3xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="ANNAPURNA Official Logo" 
            className="h-16 sm:h-20 w-auto object-contain drop-shadow-2xl animate-pulse" 
          />
          <div className="text-left">
            <div className="font-cursive font-bold text-2xl sm:text-3xl text-amber-100 tracking-wider">
              ANNAPURNA
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 uppercase tracking-widest">
              Designed to Nourish • Built to Share
            </div>
          </div>
        </div>
      </div>

      {/* Floating Transition Button to Enter Main Platform */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={onEnterPlatform}
          className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#C86D44] via-amber-500 to-[#C86D44] hover:from-[#B35C33] hover:to-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-3 border border-amber-300/40 backdrop-blur-xl animate-bounce"
        >
          <Utensils className="w-4 h-4 text-amber-200" />
          <span>ENTER ANNAPURNA PLATFORM</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-200" />
        </button>
      </div>
    </div>
  );
};
