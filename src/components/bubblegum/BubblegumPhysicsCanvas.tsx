import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { 
  Sparkles, RefreshCw, ArrowDown, Play, RotateCcw, Zap, Sliders, Flame, Compass, Volume2, VolumeX, Plus, ChevronUp, ChevronDown
} from 'lucide-react';

export interface ColorScheme {
  name: string;
  gradient: [string, string, string];
  textColor: string;
  shadowColor: string;
  glowColor: string;
}

export const BUBBLEGUM_PALETTES: ColorScheme[] = [
  {
    name: 'Strawberry Pink',
    gradient: ['#FF75A0', '#FF4D8D', '#D80056'],
    textColor: '#FFF0F5',
    shadowColor: 'rgba(216, 0, 86, 0.4)',
    glowColor: 'rgba(255, 117, 160, 0.6)'
  },
  {
    name: 'Cotton Candy Blue',
    gradient: ['#70E0FF', '#00C2FF', '#0070B8'],
    textColor: '#F0FBFF',
    shadowColor: 'rgba(0, 112, 184, 0.4)',
    glowColor: 'rgba(112, 224, 255, 0.6)'
  },
  {
    name: 'Grape Jelly',
    gradient: ['#E056FD', '#B5179E', '#5B0060'],
    textColor: '#FAF0FC',
    shadowColor: 'rgba(91, 0, 96, 0.4)',
    glowColor: 'rgba(224, 86, 253, 0.6)'
  },
  {
    name: 'Lemon Drop',
    gradient: ['#FFE600', '#FFAB00', '#D86B00'],
    textColor: '#FFFDF0',
    shadowColor: 'rgba(216, 107, 0, 0.4)',
    glowColor: 'rgba(255, 230, 0, 0.6)'
  },
  {
    name: 'Mint Fresh',
    gradient: ['#54F7D3', '#00D2A0', '#007A5E'],
    textColor: '#F0FFF9',
    shadowColor: 'rgba(0, 122, 94, 0.4)',
    glowColor: 'rgba(84, 247, 211, 0.6)'
  },
  {
    name: 'Juicy Mango',
    gradient: ['#FF9770', '#FF70A6', '#C72C61'],
    textColor: '#FFF5F0',
    shadowColor: 'rgba(199, 44, 97, 0.4)',
    glowColor: 'rgba(255, 151, 112, 0.6)'
  }
];

export const INITIAL_WORDS = [
  'ANNAPURNA', 'NOURISH', 'RESCUE', 'SHARE', 'BUBBLEGUM', 
  'YUMMY', 'DELICIOUS', 'COMMUNITY', 'SQUISHY', 'BOUNCE', 
  'IMPACT', 'FRESH', 'FOOD', 'SMILE', 'POP'
];

interface WordObject {
  id: string;
  text: string;
  body: Matter.Body;
  width: number;
  height: number;
  fontSize: number;
  palette: ColorScheme;
  squashX: number;
  squashY: number;
  targetSquashX: number;
  targetSquashY: number;
}

interface BubblegumPhysicsCanvasProps {
  onBackToHome?: () => void;
}

export const BubblegumPhysicsCanvas: React.FC<BubblegumPhysicsCanvasProps> = ({ onBackToHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  const wordsRef = useRef<WordObject[]>([]);
  const boundariesRef = useRef<Matter.Body[]>([]);

  const [inputWord, setInputWord] = useState('');
  const [gravityMode, setGravityMode] = useState<'earth' | 'zero' | 'reverse' | 'heavy'>('earth');
  const [activePaletteIdx, setActivePaletteIdx] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const [introStage, setIntroStage] = useState<'floating' | 'falling' | 'interactive'>('floating');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize Physics Engine & Render Loop
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Matter.js Engine & Runner
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 } // Start floating for cinematic intro!
    });
    engineRef.current = engine;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Viewport Boundary Walls
    const wallOptions = { isStatic: true, restitution: 0.8, friction: 0.1 };
    const thickness = 100;

    const ground = Matter.Bodies.rectangle(width / 2, height + thickness / 2 - 10, width * 2, thickness, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height * 2, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -thickness / 2 - 200, width * 2, thickness, wallOptions);

    boundariesRef.current = [ground, leftWall, rightWall, ceiling];
    Matter.Composite.add(engine.world, boundariesRef.current);

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      canvas.width = w;
      canvas.height = h;

      Matter.Body.setPosition(ground, { x: w / 2, y: h + thickness / 2 - 10 });
      Matter.Body.setPosition(leftWall, { x: -thickness / 2, y: h / 2 });
      Matter.Body.setPosition(rightWall, { x: w + thickness / 2, y: h / 2 });
      Matter.Body.setPosition(ceiling, { x: w / 2, y: -thickness / 2 - 200 });
    };

    window.addEventListener('resize', handleResize);

    // Initial Spawn of Words
    const initialSpawn = () => {
      const isMobile = width < 640;
      const spawnList = isMobile ? INITIAL_WORDS.slice(0, 8) : INITIAL_WORDS;

      spawnList.forEach((text, i) => {
        const x = (width * 0.15) + (i % 4) * (width * 0.22) + (Math.random() * 40 - 20);
        const y = 80 + Math.floor(i / 4) * 90 + (Math.random() * 30 - 15);
        spawnWordObject(text, x, y, BUBBLEGUM_PALETTES[i % BUBBLEGUM_PALETTES.length]);
      });
    };

    initialSpawn();

    // Cinematic Intro Sequence Timer
    const introTimer1 = setTimeout(() => {
      setIntroStage('falling');
      if (engineRef.current) {
        engineRef.current.gravity.y = 1.2; // Gravity activates!
      }
    }, 1800);

    const introTimer2 = setTimeout(() => {
      setIntroStage('interactive');
    }, 3200);

    // 60 FPS Render Loop
    let animationFrameId: number;

    const renderLoop = () => {
      const ctx = canvas.getContext('2d');
      if (ctx && engineRef.current) {
        const w = canvas.width;
        const h = canvas.height;

        // Clear Canvas with Soft Dark Candy Gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0E0B1F');
        bgGrad.addColorStop(0.5, '#150F2D');
        bgGrad.addColorStop(1, '#0A0716');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Draw Ambient Floating Jelly Particles
        const now = Date.now() * 0.001;
        for (let p = 0; p < 15; p++) {
          const px = (Math.sin(now + p * 1.5) * 0.4 + 0.5) * w;
          const py = (Math.cos(now * 0.8 + p * 2.1) * 0.4 + 0.5) * h;
          const pSize = (Math.sin(now + p) + 2) * 3;
          ctx.fillStyle = p % 2 === 0 ? 'rgba(255, 117, 160, 0.15)' : 'rgba(0, 210, 255, 0.15)';
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }

        // Render Words
        wordsRef.current.forEach((wObj) => {
          renderBubblegumWord(ctx, wObj);
        });
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(introTimer1);
      clearTimeout(introTimer2);
      cancelAnimationFrame(animationFrameId);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.World.clear(engineRef.current.world, false);
    };
  }, []);

  // Spawn Bubblegum Word Physics Object Function
  const spawnWordObject = (
    text: string, 
    x: number, 
    y: number, 
    paletteOverride?: ColorScheme
  ) => {
    if (!engineRef.current || !canvasRef.current) return;

    const isMobile = window.innerWidth < 640;
    const fontScale = isMobile ? 0.75 : 1.0;
    
    // Dynamic Font Sizing according to word length
    let fontSize = Math.max(34, Math.min(54, 300 / (text.length * 0.65))) * fontScale;
    const paddingX = fontSize * 0.7;
    const paddingY = fontSize * 0.4;

    // Measure text width using temporary canvas context
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.font = `900 ${fontSize}px Fredoka, "Titan One", sans-serif`;
    }
    const textWidth = tempCtx ? tempCtx.measureText(text.toUpperCase()).width : text.length * fontSize * 0.7;

    const width = textWidth + paddingX * 2;
    const height = fontSize + paddingY * 2;

    const palette = paletteOverride || BUBBLEGUM_PALETTES[Math.floor(Math.random() * BUBBLEGUM_PALETTES.length)];

    // Matter.js Chamfered Rect Body for Puffy Soft Collisions
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      restitution: 0.75, // Bouncy bubblegum!
      friction: 0.05,    // Slippery soft surface
      frictionAir: 0.012,// Soft air float
      density: 0.002,    // Light squishy mass
      chamfer: { radius: height / 2.2 } // Rounded puffy corners!
    });

    // Give slight initial random spin & impulse
    Matter.Body.setAngle(body, (Math.random() - 0.5) * 0.3);
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

    const wObj: WordObject = {
      id: `w-${Date.now()}-${Math.random()}`,
      text: text.toUpperCase(),
      body,
      width,
      height,
      fontSize,
      palette,
      squashX: 1.0,
      squashY: 1.0,
      targetSquashX: 1.0,
      targetSquashY: 1.0
    };

    wordsRef.current.push(wObj);
    Matter.Composite.add(engineRef.current.world, body);
    setWordCount(wordsRef.current.length);
  };

  // Render Inflated 3D Glossy Bubblegum Word
  const renderBubblegumWord = (ctx: CanvasRenderingContext2D, wObj: WordObject) => {
    const { body, text, width, height, fontSize, palette } = wObj;
    const { x, y } = body.position;
    const angle = body.angle;

    // Calculate Squash-and-Stretch Deformation from physics velocity
    const vx = body.velocity.x;
    const vy = body.velocity.y;
    const speed = Math.sqrt(vx * vx + vy * vy);

    wObj.targetSquashX = 1.0 + Math.abs(vx) * 0.012 - Math.abs(vy) * 0.008;
    wObj.targetSquashY = 1.0 + Math.abs(vy) * 0.012 - Math.abs(vx) * 0.008;

    // Spring Damper Interpolation for soft elastic wobble
    wObj.squashX += (wObj.targetSquashX - wObj.squashX) * 0.15;
    wObj.squashY += (wObj.targetSquashY - wObj.squashY) * 0.15;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(wObj.squashX, wObj.squashY);

    const halfW = width / 2;
    const halfH = height / 2;
    const radius = halfH;

    // 1. Soft Multi-layered Drop Shadow Underneath
    ctx.save();
    ctx.shadowColor = palette.shadowColor;
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, width, height, radius);
    ctx.fill();
    ctx.restore();

    // 2. Main 3D Puffy Inflated Capsule Base
    const bodyGrad = ctx.createLinearGradient(-halfW, -halfH, halfW, halfH);
    bodyGrad.addColorStop(0, palette.gradient[0]);
    bodyGrad.addColorStop(0.5, palette.gradient[1]);
    bodyGrad.addColorStop(1, palette.gradient[2]);

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, width, height, radius);
    ctx.fill();

    // 3. Inner Ambient Glow Border
    ctx.lineWidth = 4;
    ctx.strokeStyle = palette.glowColor;
    ctx.stroke();

    // 4. Glossy Specular Reflection Arc (Top Edge Vinyl Specular Highlight)
    ctx.save();
    const specGrad = ctx.createLinearGradient(0, -halfH, 0, 0);
    specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = specGrad;
    ctx.beginPath();
    ctx.roundRect(-halfW + 6, -halfH + 4, width - 12, halfH * 0.7, radius * 0.7);
    ctx.fill();
    ctx.restore();

    // 5. Secondary Curved Specular Bubble Pill Highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.ellipse(-halfW + radius * 0.8, -halfH + radius * 0.6, radius * 0.35, radius * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // 6. Chunky Puffy Bubblegum Typography
    ctx.font = `900 ${fontSize}px Fredoka, "Titan One", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text Shadow / 3D Bevel Offset
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillText(text, 0, 3);

    // Text Stroke Border
    ctx.lineWidth = Math.max(3, fontSize * 0.08);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.strokeText(text, 0, 0);

    // Main Inflated White/Light Text Fill
    ctx.fillStyle = palette.textColor;
    ctx.fillText(text, 0, 0);

    // Text Specular Shine Overprint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(text, -1, -1);

    ctx.restore();
  };

  // Touch / Pointer Hover Sideways Poking Impulse & Dragging Physics
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const radius = 130; // Interaction influence radius

    wordsRef.current.forEach((wObj) => {
      const { body } = wObj;
      const dx = body.position.x - px;
      const dy = body.position.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius && dist > 2) {
        // Calculate Impulse magnitude pushing SIDEWAYS to Left or Right!
        const influence = (1 - dist / radius);
        const directionX = Math.sign(dx) || (Math.random() > 0.5 ? 1 : -1);

        // Strong physical impulse pushing sideways
        const forceX = directionX * influence * 0.09;
        const forceY = -influence * 0.02; // Slight upward lift

        Matter.Body.applyImpulse(body, body.position, { x: forceX, y: forceY });
        
        // Spin wobble!
        Matter.Body.setAngularVelocity(body, body.angularVelocity + directionX * influence * 0.12);
      }
    });
  };

  // Click / Tap Explosion Blast Impulse
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    wordsRef.current.forEach((wObj) => {
      const { body } = wObj;
      const dx = body.position.x - px;
      const dy = body.position.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 220) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - dist / 220) * 0.25;
        Matter.Body.applyImpulse(body, body.position, {
          x: Math.cos(angle) * force,
          y: Math.sin(angle) * force - 0.05
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);
      }
    });
  };

  // Add Custom User Word
  const handleAddCustomWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWord.trim() || !canvasRef.current) return;

    const w = canvasRef.current.width;
    const spawnX = w * 0.3 + Math.random() * (w * 0.4);
    const spawnY = 60;

    const chosenPalette = BUBBLEGUM_PALETTES[activePaletteIdx % BUBBLEGUM_PALETTES.length];
    spawnWordObject(inputWord.trim(), spawnX, spawnY, chosenPalette);
    setInputWord('');
  };

  // Change Gravity Mode
  const handleGravityChange = (mode: 'earth' | 'zero' | 'reverse' | 'heavy') => {
    setGravityMode(mode);
    if (!engineRef.current) return;

    switch (mode) {
      case 'earth':
        engineRef.current.gravity.y = 1.0;
        engineRef.current.gravity.x = 0;
        break;
      case 'zero':
        engineRef.current.gravity.y = 0;
        engineRef.current.gravity.x = 0;
        break;
      case 'reverse':
        engineRef.current.gravity.y = -0.8;
        engineRef.current.gravity.x = 0;
        break;
      case 'heavy':
        engineRef.current.gravity.y = 2.5;
        engineRef.current.gravity.x = 0;
        break;
    }
  };

  // Clear All Words
  const handleClearAll = () => {
    if (!engineRef.current) return;
    wordsRef.current.forEach((wObj) => {
      Matter.Composite.remove(engineRef.current!.world, wObj.body);
    });
    wordsRef.current = [];
    setWordCount(0);
  };

  // Scatter All Impulse
  const handleScatterAll = () => {
    wordsRef.current.forEach((wObj) => {
      const forceX = (Math.random() - 0.5) * 0.3;
      const forceY = -Math.random() * 0.2 - 0.1;
      Matter.Body.applyImpulse(wObj.body, wObj.body.position, { x: forceX, y: forceY });
      Matter.Body.setAngularVelocity(wObj.body, (Math.random() - 0.5) * 0.4);
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#0E0B1F] select-none font-bubblegum text-white"
    >
      {/* 2D Physics Canvas Layer */}
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onClick={handleCanvasClick}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Cinematic Intro Banner */}
      {introStage !== 'interactive' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center space-y-3 pointer-events-none animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{introStage === 'floating' ? 'FLOATING WORDS READY...' : 'GRAVITY ACTIVATED!'}</span>
          </div>
          <h1 className="font-bubblegum text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 drop-shadow-2xl uppercase">
            {introStage === 'floating' ? 'SOFT BUBBLEGUM WORDS' : 'WATCH THEM FALL & SQUISH!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">
            Poke, drag, throw, and push the puffy inflated words sideways across the floor.
          </p>
        </div>
      )}

      {/* Top Header Controls Overlay */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-6xl w-[94%] transition-all">
        <div className="bg-[#150F2D]/80 border border-purple-500/30 backdrop-blur-xl shadow-2xl rounded-full px-5 py-2.5 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 text-white flex items-center justify-center font-bubblegum font-black text-lg shadow-lg border border-white/40">
              B
            </div>
            <div>
              <div className="font-bubblegum font-black text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-cyan-300 tracking-wider">
                ANNAPURNA • BUBBLEGUM
              </div>
              <div className="text-[9px] font-mono text-purple-300 tracking-widest uppercase hidden sm:block">
                GRAVITY TYPOGRAPHY PHYSICS • {wordCount} WORDS ACTIVE
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleScatterAll}
              className="px-3.5 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 text-xs font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
              title="Explode & Scatter Words"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scatter</span>
            </button>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                Exit to App
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Word Creator Bar (Bottom Center Overlay) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-xl w-[92%]">
        <div className="bg-[#150F2D]/90 border border-purple-500/40 backdrop-blur-2xl shadow-2xl rounded-3xl p-3 sm:p-4 space-y-3">
          
          {/* Custom Word Input Form */}
          <form onSubmit={handleAddCustomWord} className="flex items-center gap-2">
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              placeholder="Type word to spawn (e.g. SQUISHY)..."
              maxLength={14}
              className="flex-1 bg-black/40 border border-purple-500/40 rounded-2xl py-2.5 px-4 text-xs sm:text-sm font-bubblegum text-white placeholder-purple-300/60 focus:outline-none focus:border-pink-400 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>DROP WORD</span>
            </button>
          </form>

          {/* Quick Gravity & Palette Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-purple-500/20 pt-2 text-xs font-mono">
            {/* Gravity Mode Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-purple-300 uppercase mr-1 hidden sm:inline">Gravity:</span>
              {[
                { id: 'earth', label: '🌍 Earth' },
                { id: 'zero', label: '🚀 Zero-G' },
                { id: 'reverse', label: '🎈 Reverse' },
                { id: 'heavy', label: '💥 Heavy' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleGravityChange(g.id as any)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    gravityMode === g.id
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-black/30 text-purple-300 hover:bg-black/50 border border-purple-500/30'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* Clear Button */}
            <button
              onClick={handleClearAll}
              className="text-[10px] text-purple-400 hover:text-pink-300 uppercase font-mono tracking-wider flex items-center gap-1 cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
