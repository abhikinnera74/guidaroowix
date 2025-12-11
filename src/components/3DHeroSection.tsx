import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hero3DProps {
  isMobile?: boolean;
}

export function Hero3DSection({ isMobile = false }: Hero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f5);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup - optimized for performance
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile ? 1 : window.devicePixelRatio);
    renderer.shadowMap.enabled = !isMobile;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create floating geometric shapes
    const geometries = [
      new THREE.IcosahedronGeometry(0.8, 4),
      new THREE.OctahedronGeometry(0.6, 2),
      new THREE.TetrahedronGeometry(0.7, 2),
      new THREE.DodecahedronGeometry(0.5, 0),
    ];

    const colors = [0x0b3d0b, 0x7a4b2b, 0xc6b9ff, 0xdf3131];
    objectsRef.current = [];

    geometries.forEach((geometry, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: colors[index],
        emissive: colors[index],
        emissiveIntensity: 0.2,
        shininess: 100,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      mesh.castShadow = !isMobile;
      mesh.receiveShadow = !isMobile;

      scene.add(mesh);
      objectsRef.current.push(mesh);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = !isMobile;
    scene.add(directionalLight);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / width;
      mouseRef.current.y = (e.clientY - rect.top) / height;
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let animationId: number;
    let frameCount = 0;
    const targetFPS = isMobile ? 30 : 60;
    const frameInterval = 1000 / targetFPS;
    let lastFrameTime = Date.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const currentTime = Date.now();
      const deltaTime = currentTime - lastFrameTime;

      // Throttle frame rate on mobile
      if (deltaTime < frameInterval) {
        return;
      }

      lastFrameTime = currentTime;
      frameCount++;

      // Animate objects
      objectsRef.current.forEach((mesh, index) => {
        // Rotation
        mesh.rotation.x += 0.002 + index * 0.0005;
        mesh.rotation.y += 0.003 + index * 0.0008;

        // Mouse tracking influence
        const targetX = mouseRef.current.y * 2 - 1;
        const targetY = mouseRef.current.x * 2 - 1;

        mesh.position.x += (targetY * 0.5 - mesh.position.x) * 0.02;
        mesh.position.y += (targetX * 0.5 - mesh.position.y) * 0.02;

        // Floating animation
        mesh.position.z += Math.sin(currentTime * 0.0005 + index) * 0.001;
      });

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometries.forEach(g => g.dispose());
      objectsRef.current.forEach(mesh => {
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
      });
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border-2 border-primary/10 shadow-2xl"
      style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease-in' }}
    />
  );
}
