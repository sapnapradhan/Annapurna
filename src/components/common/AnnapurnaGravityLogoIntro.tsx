import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { ArrowRight, Sparkles, Utensils } from 'lucide-react';

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
      gravity: { x: 0, y: 1.1 }
    });
    engineRef.current = engine;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    const wallOptions = { isStatic: true, restitution: 0.85, friction: 0.1 };
    const thickness = 120;

    const ground = Matter.Bodies.rectangle(width / 2, height + thickness / 2 - 15, width * 2, thickness, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2 - 300, width * 2, thickness, wallOptions);

    boundariesRef.current = [ground, leftWall, rightWall, ceiling];
    Matter.Composite.add(engine.world, boundariesRef.current);

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      canvas.width = w;
      canvas.height = h;

      Matter.Body.setPosition(ground, { x: w / 2, y: h + thickness / 2 - 15 });
      Matter.Body.setPosition(leftWall, { x: -thickness / 2, y: h / 2 });
      Matter.Body.setPosition(rightWall, { x: w + thickness / 2, y: h / 2 });
      Matter.Body.setPosition(ceiling, { x: w / 2, y: -thickness / 2 - 300 });
    };

    window.addEventListener('resize', handleResize);

    let dropIndex = 0;
    const dropInterval = setInterval(() => {
      if (dropIndex < LOGO_ITEMS.length) {
        const item = LOGO_ITEMS[dropIndex];
        const isMobile = width < 640;
        
        let spawnX = width * 0.5;
        if (item.isLetter) {
          const letterIdx = dropIndex;
          const totalLetters = 9;
          const startX = width * (isMobile ? 0.12 : 0.22);
          const gap = (width * (isMobile ? 0.76 : 0.56)) / (totalLetters - 1);
          spawnX = startX + letterIdx * gap + (Math.random() * 20 - 10);
        } else {
          spawnX = width * 0.3 + (Math.random() * width * 0.4);
        }

        const spawnY = -60 - (dropIndex * 20);
        spawnSquishyItem(item.text, item.isLetter, spawnX, spawnY, LOGO_PALETTES[dropIndex % LOGO_PALETTES.length]);
        
        dropIndex++;
      } else {
        clearInterval(dropInterval);
      }
    }, 280);

    let animationFrameId: number;

    const renderLoop = () => {
      const ctx = canvas.getContext('2d');
      if (ctx && engineRef.current) {
        const w = canvas.width;
        const h = canvas.height;

        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#090807');
        bgGrad.addColorStop(0.5, '#14100D');
        bgGrad.addColorStop(1, '#090807');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        const now = Date.now() * 0.001;
        for (let p = 0; p < 12; p++) {
          const px = (Math.sin(now + p * 1.5) * 0.4 + 0.5) * w;
          const py = (Math.cos(now * 0.8 + p * 2.1) * 0.4 + 0.5) * h;
          const pSize = (Math.sin(now * 2 + p) + 2) * 3;
          ctx.fillStyle = p % 2 === 0 ? 'rgba(200, 109, 68, 0.2)' : 'rgba(212, 140, 70, 0.2)';
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }

        lettersRef.current.forEach((itemObj) => {
          renderSquishyLetter(ctx, itemObj, now);
        });
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(dropInterval);
      cancelAnimationFrame(animationFrameId);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.World.clear(engineRef.current.world, false);
    };
  }, []);

  const spawnSquishyItem = (
    text: string, 
    isLetter: boolean,
    x: number, 
    y: number, 
    palette: ColorScheme
  ) => {
    if (!engineRef.current || !canvasRef.current) return;

    const isMobile = window.innerWidth < 640;
    
    let fontSize = isLetter ? (isMobile ? 48 : 72) : (isMobile ? 32 : 44);
    const paddingX = isLetter ? fontSize * 0.4 : fontSize * 0.6;
    const paddingY = fontSize * 0.35;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.font = `900 ${fontSize}px Fredoka, "Titan One", sans-serif`;
    }
    const textWidth = tempCtx ? tempCtx.measureText(text).width : text.length * fontSize * 0.7;

    const width = Math.max(fontSize * 1.1, textWidth + paddingX * 2);
    const height = fontSize + paddingY * 2;

    const body = Matter.Bodies.rectangle(x, y, width, height, {
      restitution: 0.82,
      friction: 0.05,
      frictionAir: 0.012,
      density: 0.0025,
      chamfer: { radius: height / 2.2 }
    });

    Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.35);
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

    const itemObj: LetterObject = {
      id: `letter-${Date.now()}-${Math.random()}`,
      text,
      body,
      width,
      height,
      fontSize,
      palette,
      isLetter,
      squashX: 1.0,
      squashY: 1.0,
      targetSquashX: 1.0,
      targetSquashY: 1.0
    };

    lettersRef.current.push(itemObj);
    Matter.Composite.add(engineRef.current.world, body);
  };

  const renderSquishyLetter = (ctx: CanvasRenderingContext2D, itemObj: LetterObject, now: number) => {
    const { body, text, width, height, fontSize, palette, isLetter } = itemObj;
    const { x, y } = body.position;
    const angle = body.angle;

    const vx = body.velocity.x;
    const vy = body.velocity.y;

    itemObj.targetSquashX = 1.0 + Math.abs(vx) * 0.014 - Math.abs(vy) * 0.01;
    itemObj.targetSquashY = 1.0 + Math.abs(vy) * 0.014 - Math.abs(vx) * 0.01;

    itemObj.squashX += (itemObj.targetSquashX - itemObj.squashX) * 0.18;
    itemObj.squashY += (itemObj.targetSquashY - itemObj.squashY) * 0.18;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(itemObj.squashX, itemObj.squashY);

    const halfW = width / 2;
    const halfH = height / 2;
    const radius = halfH;

    ctx.save();
    ctx.shadowColor = palette.shadowColor;
    ctx.shadowBlur = isLetter ? 32 : 24;
    ctx.shadowOffsetY = 14;
    ctx.fillStyle = palette.gradient[1];
    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, width, height, radius);
    ctx.fill();
    ctx.restore();

    const bodyGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
    bodyGrad.addColorStop(0, palette.gradient[0]);
    bodyGrad.addColorStop(0.5, palette.gradient[1]);
    bodyGrad.addColorStop(1, palette.gradient[2]);

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, width, height, radius);
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = palette.glowColor;
    ctx.stroke();

    ctx.save();
    const specGrad = ctx.createLinearGradient(0, -halfH, 0, 0);
    specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = specGrad;
    ctx.beginPath();
    ctx.roundRect(-halfW + 6, -halfH + 4, width - 12, halfH * 0.75, radius * 0.7);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.ellipse(-halfW + radius * 0.75, -halfH + radius * 0.55, radius * 0.35, radius * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `900 ${fontSize}px Fredoka, "Titan One", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.shadowColor = palette.glowColor;
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, 0, 0);
    ctx.restore();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillText(text, 0, 3);

    ctx.lineWidth = Math.max(3, fontSize * 0.08);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeText(text, 0, 0);

    const sheenOffset = (Math.sin(now * 3 + x * 0.01) * 0.5 + 0.5) * width - halfW;
    const textSheenGrad = ctx.createLinearGradient(sheenOffset - 30, 0, sheenOffset + 30, 0);
    textSheenGrad.addColorStop(0, palette.textColor);
    textSheenGrad.addColorStop(0.5, '#FFFFFF');
    textSheenGrad.addColorStop(1, palette.textColor);

    ctx.fillStyle = textSheenGrad;
    ctx.fillText(text, 0, 0);

    if (isLetter) {
      const starOpacity = Math.sin(now * 4 + y * 0.02) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
      ctx.font = `${fontSize * 0.35}px sans-serif`;
      ctx.fillText('✨', -halfW + 16, -halfH + 14);
    }

    ctx.restore();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const radius = 140;

    lettersRef.current.forEach((itemObj) => {
      const { body } = itemObj;
      const dx = body.position.x - px;
      const dy = body.position.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius && dist > 2) {
        const influence = (1 - dist / radius);
        const directionX = Math.sign(dx) || (Math.random() > 0.5 ? 1 : -1);

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
      className="relative w-screen h-screen overflow-hidden bg-[#090807] select-none font-bubblegum text-white"
    >
      {/* 2D Physics Canvas Layer */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onClick={handleCanvasClick}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Floating Transition Button to Enter Main Platform */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={onEnterPlatform}
          className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#C86D44] via-amber-500 to-[#C86D44] hover:from-[#B35C33] hover:to-[#B35C33] text-white font-bold text-xs uppercase tracking-widest shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-3 border border-amber-300/40 backdrop-blur-xl animate-pulse"
        >
          <Utensils className="w-4 h-4 text-amber-200" />
          <span>ENTER ANNAPURNA PLATFORM</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-200" />
        </button>
      </div>
    </div>
  );
};
