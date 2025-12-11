import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GlobeMarkerProps {
  width?: number;
  height?: number;
}

export function GlobeMarker({ width = 400, height = 400 }: GlobeMarkerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2.5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create globe geometry
    const geometry = new THREE.IcosahedronGeometry(1, 32);
    
    // Create canvas texture for globe
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background - ocean blue
      ctx.fillStyle = '#1e90ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Land masses - green
      ctx.fillStyle = '#228b22';
      // Simple continents representation
      ctx.fillRect(100, 300, 400, 300);
      ctx.fillRect(800, 200, 500, 400);
      ctx.fillRect(1400, 250, 300, 350);
      ctx.fillRect(1800, 100, 200, 200);

      // Add some texture variation
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, Math.random() * 20, Math.random() * 20);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 5,
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    globeRef.current = globe;

    // Add marker point on globe
    const markerGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    // Position marker on globe surface (e.g., somewhere in Europe)
    const lat = 0.5;
    const lon = 0.3;
    const x = Math.cos(lat) * Math.cos(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.sin(lon);
    marker.position.set(x * 1.1, y * 1.1, z * 1.1);
    globe.add(marker);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Mouse interaction
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / width;
      mouseRef.current.y = (e.clientY - rect.top) / height;
    };

    const onMouseEnter = () => setIsRotating(false);
    const onMouseLeave = () => {
      setIsRotating(true);
      rotationRef.current = { x: 0, y: 0 };
    };

    const onClick = () => {
      setIsRotating(!isRotating);
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('mouseenter', onMouseEnter);
    containerRef.current.addEventListener('mouseleave', onMouseLeave);
    containerRef.current.addEventListener('click', onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (globeRef.current) {
        if (isRotating) {
          globeRef.current.rotation.y += 0.001;
          globeRef.current.rotation.x += 0.0003;
        } else {
          // Smooth mouse tracking
          rotationRef.current.x += (mouseRef.current.y * 2 - rotationRef.current.x) * 0.05;
          rotationRef.current.y += (mouseRef.current.x * 2 - rotationRef.current.y) * 0.05;
          globeRef.current.rotation.x = rotationRef.current.x;
          globeRef.current.rotation.y = rotationRef.current.y;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeEventListener('mouseenter', onMouseEnter);
      containerRef.current?.removeEventListener('mouseleave', onMouseLeave);
      containerRef.current?.removeEventListener('click', onClick);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [width, height, isRotating]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="rounded-2xl overflow-hidden border-2 border-secondary/20 cursor-pointer hover:border-secondary/40 transition-colors"
        style={{ width, height }}
      />
      <p className="text-sm text-foreground/60 font-paragraph">
        {isRotating ? 'Click to interact • Hover to rotate manually' : 'Click to auto-rotate'}
      </p>
    </div>
  );
}
