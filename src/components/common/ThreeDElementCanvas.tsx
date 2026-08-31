import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDElementCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. 3D Objects — Central Gold Thali Ring & Spheres
    const group = new THREE.Group();
    scene.add(group);

    // Main 3D Outer Ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.12, 32, 100);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xE67E22,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false
    });
    const ringMesh = new THREE.Mesh(ringGeo, goldMat);
    group.add(ringMesh);

    // Inner 3D Meal Plate Disc
    const discGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.08, 64);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x1A1412,
      metalness: 0.6,
      roughness: 0.3
    });
    const discMesh = new THREE.Mesh(discGeo, innerMat);
    discMesh.rotation.x = Math.PI / 2;
    group.add(discMesh);

    // Orbiting 3D Spheres (Representing Food Katori Bowls)
    const katoriGeom = new THREE.SphereGeometry(0.32, 32, 32);
    const colors = [0xF1C40F, 0xE74C3C, 0x2ECC71, 0x9B59B6, 0x3498DB];
    const katoris: THREE.Mesh[] = [];

    colors.forEach((col, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: col,
        metalness: 0.7,
        roughness: 0.25
      });
      const mesh = new THREE.Mesh(katoriGeom, mat);
      const angle = (idx / colors.length) * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * 0.95;
      mesh.position.y = Math.sin(angle) * 0.95;
      mesh.position.z = 0.12;
      group.add(mesh);
      katoris.push(mesh);
    });

    // 3. Floating 3D Star/Particle Cloud
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 8;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xF39C12,
      size: 0.05,
      transparent: true,
      opacity: 0.8
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xF39C12, 3, 50);
    pointLight1.position.set(4, 4, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xE74C3C, 2, 50);
    pointLight2.position.set(-4, -4, 3);
    scene.add(pointLight2);

    // 5. Mouse Interaction for 3D Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = x / (width / 2);
      mouseY = y / (height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous Idle Rotation
      group.rotation.z = elapsedTime * 0.3;
      particleSystem.rotation.y = elapsedTime * 0.1;

      // Mouse Tilt Smoothing
      targetRotationY = mouseX * 0.5;
      targetRotationX = -mouseY * 0.5;

      group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;
      group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;

      // Floating bobbing motion
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Handler
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
    <div className="relative w-full h-72 sm:h-80 flex items-center justify-center pointer-events-auto">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 text-[10px] font-mono font-bold text-amber-300/80 bg-black/40 px-3 py-1 rounded-full border border-amber-500/20 backdrop-blur-sm pointer-events-none uppercase tracking-widest flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>INTERACTIVE 3D EMBLEM • MOVE MOUSE TO TILT</span>
      </div>
    </div>
  );
};
