'use client';

import { useEffect, useRef } from 'react';

interface FloatingElement {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'circle' | 'triangle' | 'square';
}

export default function ExperienceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation systems
    const floatingElements: FloatingElement[] = [];
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981'];
    
    // Create floating element
    const createFloatingElement = () => {
      const element: FloatingElement = {
        x: Math.random() * (canvas.width - 256) + 256, // Only in main content area
        y: canvas.height + 20,
        size: Math.random() * 8 + 4,
        speed: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: Math.random() * 2000 + 1000,
        type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)] as 'circle' | 'triangle' | 'square'
      };
      floatingElements.push(element);
    };

    // Draw different shapes
    const drawShape = (element: FloatingElement) => {
      ctx.save();
      ctx.globalAlpha = 1 - (element.life / element.maxLife);
      ctx.fillStyle = element.color;
      ctx.strokeStyle = element.color;
      ctx.lineWidth = 1;

      switch (element.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(element.x, element.y - element.size);
          ctx.lineTo(element.x - element.size, element.y + element.size);
          ctx.lineTo(element.x + element.size, element.y + element.size);
          ctx.closePath();
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(element.x - element.size, element.y - element.size, element.size * 2, element.size * 2);
          break;
      }
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new floating elements occasionally
      if (Math.random() < 0.02) {
        createFloatingElement();
      }

      // Update and draw floating elements
      for (let i = floatingElements.length - 1; i >= 0; i--) {
        const element = floatingElements[i];

        // Update position
        element.y -= element.speed;
        element.life++;

        // Add subtle horizontal movement
        element.x += Math.sin(element.life * 0.01) * 0.2;

        // Remove old elements
        if (element.life > element.maxLife || element.y < -20) {
          floatingElements.splice(i, 1);
          continue;
        }

        // Draw element
        drawShape(element);
      }

      // Draw subtle gradient overlay
      ctx.save();
      const gradient = ctx.createLinearGradient(256, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.02)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.02)');
      ctx.fillStyle = gradient;
      ctx.fillRect(256, 0, canvas.width - 256, canvas.height);
      ctx.restore();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 1
      }}
    />
  );
}
