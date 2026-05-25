"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particles Data
    const particlesCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);
    const speeds = new Float32Array(particlesCount);
    const sways = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      // Spread across viewport bounds in 3D space
      positions[i3] = (Math.random() - 0.5) * 15; // X
      positions[i3 + 1] = (Math.random() - 0.5) * 10; // Y
      positions[i3 + 2] = (Math.random() - 0.5) * 5; // Z
      
      speeds[i] = Math.random() * 0.008 + 0.002; // Vertical speed
      sways[i] = Math.random() * 0.004 + 0.001; // Horizontal sway
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Circle Texture
    const createCircleTexture = () => {
      const matCanvas = document.createElement("canvas");
      matCanvas.width = 16;
      matCanvas.height = 16;
      const matContext = matCanvas.getContext("2d");
      if (matContext) {
        const gradient = matContext.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(247, 231, 161, 1)"); // Champagne Gold center
        gradient.addColorStop(0.3, "rgba(212, 175, 55, 0.8)"); // Gold mid
        gradient.addColorStop(1, "rgba(212, 175, 55, 0)"); // Fade out
        matContext.fillStyle = gradient;
        matContext.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(matCanvas);
    };

    // Material
    const material = new THREE.PointsMaterial({
      size: 0.16,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Points Group
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation variables
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Soft rotation
      points.rotation.y = elapsedTime * 0.02;
      points.rotation.x = elapsedTime * 0.01;

      // Inertia on mouse coordinates
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      points.position.x = targetX * 1.5;
      points.position.y = targetY * 1.5;

      // Float upward & sway side-to-side
      const positionsArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Upward movement
        positionsArray[i3 + 1] += speeds[i];
        
        // Horizontal sway using sine wave
        positionsArray[i3] += Math.sin(elapsedTime + i) * sways[i];

        // Reset if particles go off-screen vertically
        if (positionsArray[i3 + 1] > 6) {
          positionsArray[i3 + 1] = -6;
          positionsArray[i3] = (Math.random() - 0.5) * 15;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
