import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDElementCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Central Group for Mouse Physics
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- A. INNER HOLOGRAPHIC AI CORE SPHERE ---
    const coreInnerGeo = new THREE.IcosahedronGeometry(0.75, 2);
    const coreInnerMat = new THREE.MeshStandardMaterial({
      color: 0xF39C12,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xD35400,
      emissiveIntensity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreInnerGeo, coreInnerMat);
    mainGroup.add(coreMesh);

    // Outer Wireframe Hologram Energy Sphere
    const wireGeo = new THREE.IcosahedronGeometry(0.92, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xF1C40F,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // --- B. DUAL COUNTER-ROTATING METALLIC 3D THALI RINGS ---
    // Outer Gold Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.85, 0.08, 32, 100);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xE67E22,
      metalness: 0.95,
      roughness: 0.15
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, goldMat);
    mainGroup.add(ring1Mesh);

    // Inner Bronze Ring 2 (Tilted Angle)
    const ring2Geo = new THREE.TorusGeometry(1.45, 0.06, 32, 100);
    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x16A085,
      metalness: 0.85,
      roughness: 0.2
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, bronzeMat);
    ring2Mesh.rotation.x = Math.PI / 4;
    ring2Mesh.rotation.y = Math.PI / 6;
    mainGroup.add(ring2Mesh);

    // --- C. ORBITING 3D FOOD GEMS / KATORIS ---
    const gemGeo = new THREE.OctahedronGeometry(0.24, 0);
    const gemColors = [0xF1C40F, 0xE74C3C, 0x2ECC71, 0x9B59B6, 0x3498DB];
    const gems: THREE.Mesh[] = [];

    gemColors.forEach((color, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.2,
        emissive: color,
        emissiveIntensity: 0.2
      });
      const mesh = new THREE.Mesh(gemGeo, mat);
      const angle = (idx / gemColors.length) * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * 1.85;
      mesh.position.y = Math.sin(angle) * 1.85;
      mesh.position.z = Math.sin(angle * 2) * 0.3;
      mainGroup.add(mesh);
      gems.push(mesh);
    });

    // --- D. FLOATING 3D PARTICLE STARDUST CLOUD ---
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colorsArr = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 9;
      positions[i + 1] = (Math.random() - 0.5) * 9;
      positions[i + 2] = (Math.random() - 0.5) * 5;

      colorsArr[i] = 0.95;
      colorsArr[i + 1] = 0.6 + Math.random() * 0.4;
      colorsArr[i + 2] = 0.2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colorsArr, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- E. MULTI-COLOR DYNAMIC LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Gold Key Light
    const goldLight = new THREE.PointLight(0xF39C12, 4, 50);
    goldLight.position.set(5, 5, 5);
    scene.add(goldLight);

    // Cyan Fill Light
    const cyanLight = new THREE.PointLight(0x16A085, 3, 50);
    cyanLight.position.set(-5, -3, 4);
    scene.add(cyanLight);

    // Crimson Backlight
    const crimsonLight = new THREE.PointLight(0xE74C3C, 3, 50);
    crimsonLight.position.set(0, -5, -4);
    scene.add(crimsonLight);

    // --- F. MOUSE PHYSICS & SMOOTH DAMPING ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x / (width / 2);
      mouseY = y / (height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // --- G. ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Core Pulse Effect
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      coreMesh.scale.set(scale, scale, scale);
      wireMesh.scale.set(scale * 1.05, scale * 1.05, scale * 1.05);

      // Rotations
      wireMesh.rotation.x = elapsedTime * 0.4;
      wireMesh.rotation.y = elapsedTime * 0.6;

      ring1Mesh.rotation.z = elapsedTime * 0.25;
      ring2Mesh.rotation.z = -elapsedTime * 0.35;

      particleSystem.rotation.y = elapsedTime * 0.08;

      // Orbiting Gems Rotation & Bobbing
      gems.forEach((gem, idx) => {
        const speed = 0.5 + idx * 0.05;
        gem.rotation.x = elapsedTime * speed;
        gem.rotation.y = elapsedTime * speed;
      });

      // Mouse Damping Physics
      targetX += (mouseX - targetX) * 0.06;
      targetY += (mouseY - targetY) * 0.06;

      mainGroup.rotation.y = targetX * 0.6;
      mainGroup.rotation.x = -targetY * 0.6;

      // Floating Bobbing Motion
      mainGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // --- H. RESIZE HANDLER ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-80 sm:h-96 flex items-center justify-center pointer-events-auto my-2">
      {/* Glow aura background behind 3D canvas */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-emerald-500/10 to-rose-500/20 rounded-full blur-3xl opacity-60 pointer-events-none animate-pulse" />
      
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />

      {/* Floating 3D Badge Indicator */}
      <div className="absolute bottom-3 z-20 text-[10px] font-mono font-bold text-amber-300 bg-black/60 px-4 py-1.5 rounded-full border border-amber-500/40 shadow-xl backdrop-blur-md pointer-events-none uppercase tracking-widest flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>HOLOGRAPHIC 3D AI EMBLEM • MOUSE INTERACTIVE</span>
      </div>
    </div>
  );
};
