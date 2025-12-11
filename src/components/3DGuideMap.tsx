import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapPin } from 'lucide-react';

interface GuideLocation {
  id: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  color: string;
}

interface Guide3DMapProps {
  guides: GuideLocation[];
  width?: number;
  height?: number;
}

export function Guide3DMap({ guides, width = 600, height = 400 }: Guide3DMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const markersRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create map plane
    const mapGeometry = new THREE.PlaneGeometry(4, 2.5);
    const mapCanvas = document.createElement('canvas');
    mapCanvas.width = 1024;
    mapCanvas.height = 640;
    const ctx = mapCanvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#e8f4f8';
      ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const x = (i / 10) * mapCanvas.width;
        const y = (i / 10) * mapCanvas.height;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mapCanvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(mapCanvas.width, y);
        ctx.stroke();
      }

      // Continents (simplified)
      ctx.fillStyle = '#c8e6c9';
      ctx.fillRect(100, 150, 300, 200);
      ctx.fillRect(500, 100, 350, 250);
      ctx.fillRect(900, 200, 100, 150);
    }

    const mapTexture = new THREE.CanvasTexture(mapCanvas);
    const mapMaterial = new THREE.MeshBasicMaterial({ map: mapTexture });
    const mapMesh = new THREE.Mesh(mapGeometry, mapMaterial);
    scene.add(mapMesh);

    // Add guide markers
    markersRef.current = [];
    guides.forEach((guide) => {
      // Normalize coordinates to map plane
      const x = (guide.lon / 180) * 2;
      const y = (guide.lat / 90) * 1.25;

      // Create marker geometry
      const markerGeometry = new THREE.ConeGeometry(0.15, 0.4, 16);
      const markerColor = parseInt(guide.color.replace('#', ''), 16);
      const markerMaterial = new THREE.MeshPhongMaterial({ color: markerColor });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);

      marker.position.set(x, y, 0.1);
      marker.castShadow = true;
      scene.add(marker);
      markersRef.current.push(marker);

      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: markerColor,
        transparent: true,
        opacity: 0.2,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.position.copy(marker.position);
      scene.add(glow);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Animate markers
      markersRef.current.forEach((marker, index) => {
        marker.rotation.z += 0.02;
        marker.position.z = 0.1 + Math.sin(Date.now() * 0.001 + index) * 0.05;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      mapGeometry.dispose();
      mapMaterial.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [guides, width, height]);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={containerRef}
        className="rounded-2xl overflow-hidden border-2 border-secondary/20"
        style={{ width, height }}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {guides.map((guide) => (
          <div key={guide.id} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: guide.color }}
            />
            <span className="font-paragraph text-foreground/70 truncate">{guide.city}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
