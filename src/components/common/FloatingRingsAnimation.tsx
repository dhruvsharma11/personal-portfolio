'use client';

import { useEffect, useRef, useState } from 'react';

interface FloatingRingsAnimationProps {
  isActive: boolean;
  onRingsComplete: () => void;
  keepVisible?: boolean;
}

interface Ring {
  radius: number;
  alpha: number;
  targetAlpha: number;
  thickness: number;
  isFormed: boolean;
}

export default function FloatingRingsAnimation({ isActive, onRingsComplete, keepVisible = false }: FloatingRingsAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Shared resize function
  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    resizeCanvas(canvas);
    window.addEventListener('resize', () => resizeCanvas(canvas));

    // Animation parameters
    const animationDuration = 3500; // 3.5 seconds total
    const startTime = Date.now();
    
    // Ring configuration - sized to properly contain the content
    const centerX = 256 + (canvas.width - 256) / 2;
    const centerY = canvas.height * 0.45; // Moved from 0.6 to 0.45 (higher up)
    
    const rings: Ring[] = [
      { radius: 280, alpha: 0, targetAlpha: 0.25, thickness: 1.5, isFormed: false },
      { radius: 360, alpha: 0, targetAlpha: 0.2, thickness: 1.5, isFormed: false },
      { radius: 440, alpha: 0, targetAlpha: 0.15, thickness: 1.5, isFormed: false },
      { radius: 520, alpha: 0, targetAlpha: 0.1, thickness: 1.5, isFormed: false },
    ];

    // Rain particles that will transform into rings
    const rainParticles: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      alpha: number;
      ringIndex: number;
      isTransforming: boolean;
      originalSize: number;
    }> = [];

    // Create rain particles
    const createRainParticles = () => {
      // Create particles for each ring
      rings.forEach((ring, ringIndex) => {
        const particleCount = 25 + ringIndex * 8; // More particles for larger rings
        
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const startRadius = 80 + Math.random() * 120; // Start from random positions
          const startAngle = angle + (Math.random() - 0.5) * 0.5; // Slight angle variation
          
          rainParticles.push({
            x: centerX + Math.cos(startAngle) * startRadius,
            y: centerY + Math.sin(startAngle) * startRadius,
            targetX: centerX + Math.cos(angle) * ring.radius,
            targetY: centerY + Math.sin(angle) * ring.radius,
            size: 1.5 + Math.random() * 2,
            alpha: 0.9,
            ringIndex,
            isTransforming: false,
            originalSize: 1.5 + Math.random() * 2
          });
        }
      });
    };

    // Animate the transformation
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Phase 1: Rain particles appear and start moving (0-0.25)
      if (progress < 0.25) {
        const phaseProgress = progress / 0.25;
        
        // Create particles gradually
        if (phaseProgress > 0.1 && rainParticles.length === 0) {
          createRainParticles();
        }
        
        // Show rain particles with fade-in effect
        rainParticles.forEach(particle => {
          const alpha = Math.min(1, phaseProgress * 4);
          ctx.save();
          ctx.globalAlpha = alpha * particle.alpha;
          ctx.fillStyle = '#87CEEB';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }
      
      // Phase 2: Rain transforms into ring formation (0.25-0.65)
      else if (progress < 0.65) {
        const phaseProgress = (progress - 0.25) / 0.4;
        
        rainParticles.forEach(particle => {
          // Smooth movement to ring positions
          particle.x += (particle.targetX - particle.x) * 0.08;
          particle.y += (particle.targetY - particle.y) * 0.08;
          
          // Start forming rings when particles are close enough
          const distance = Math.sqrt(
            Math.pow(particle.x - particle.targetX, 2) + 
            Math.pow(particle.y - particle.targetY, 2)
          );
          
          if (distance < 8) {
            particle.isTransforming = true;
            rings[particle.ringIndex].alpha += 0.015;
            rings[particle.ringIndex].alpha = Math.min(rings[particle.ringIndex].alpha, rings[particle.ringIndex].targetAlpha);
          }
          
          // Draw transforming particles with size animation
          const sizeMultiplier = 1 + (phaseProgress * 0.5);
          ctx.save();
          ctx.globalAlpha = particle.alpha * (1 - phaseProgress * 0.3);
          ctx.fillStyle = '#87CEEB';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.originalSize * sizeMultiplier, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }
      
      // Phase 3: Rings fully form and stabilize (0.65-1.0)
      else {
        const phaseProgress = (progress - 0.65) / 0.35;
        
        // Draw fully formed rings with smooth appearance
        rings.forEach((ring) => {
          const finalAlpha = ring.targetAlpha * (0.8 + phaseProgress * 0.2);
          
          ctx.save();
          ctx.globalAlpha = finalAlpha;
          ctx.strokeStyle = '#87CEEB';
          ctx.lineWidth = ring.thickness;
          
          // Create smooth ring with subtle irregularities for organic feel
          ctx.beginPath();
          const segments = 80; // More segments for smoother rings
          for (let i = 0; i <= segments; i++) {
            const angle = (Math.PI * 2 * i) / segments;
            const irregularity = Math.sin(angle * 4) * 1.5 + Math.sin(angle * 9) * 0.8;
            const x = centerX + Math.cos(angle) * (ring.radius + irregularity);
            const y = centerY + Math.sin(angle) * (ring.radius + irregularity);
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
          
          // Mark ring as formed
          if (phaseProgress > 0.3) {
            ring.isFormed = true;
          }
        });
        
        // Fade out remaining particles smoothly
        rainParticles.forEach(particle => {
          if (!particle.isTransforming) {
            particle.alpha *= 0.92;
          }
        });
      }

      // Check if animation is complete
      if (progress >= 1) {
        setAnimationComplete(true);
        onRingsComplete();
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', () => resizeCanvas(canvas));
    };
  }, [isActive, onRingsComplete]);

  // Draw static rings when keepVisible is true and animation is complete
  useEffect(() => {
    if (!keepVisible || !animationComplete) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawStaticRings = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = 256 + (canvas.width - 256) / 2;
      const centerY = canvas.height * 0.45; // Moved from 0.6 to 0.45 (higher up)
      

      
      const rings: Ring[] = [
        { radius: 280, alpha: 0.25, targetAlpha: 0.25, thickness: 1.5, isFormed: true },
        { radius: 360, alpha: 0.2, targetAlpha: 0.2, thickness: 1.5, isFormed: true },
        { radius: 440, alpha: 0.15, targetAlpha: 0.15, thickness: 1.5, isFormed: true },
        { radius: 520, alpha: 0.1, targetAlpha: 0.1, thickness: 1.5, isFormed: true },
      ];

      // Draw static rings
      rings.forEach((ring) => {
        ctx.save();
        ctx.globalAlpha = ring.alpha;
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = ring.thickness;
        
        // Create smooth ring with subtle irregularities
        ctx.beginPath();
        const segments = 80;
        for (let i = 0; i <= segments; i++) {
          const angle = (Math.PI * 2 * i) / segments;
          const irregularity = Math.sin(angle * 4) * 1.5 + Math.sin(angle * 9) * 0.8;
          const x = centerX + Math.cos(angle) * (ring.radius + irregularity);
          const y = centerY + Math.sin(angle) * (ring.radius + irregularity);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });
    };

    drawStaticRings();

    // Handle resize for static rings
    const handleResize = () => {
      resizeCanvas(canvas);
      drawStaticRings();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [keepVisible, animationComplete]);

  if (!isActive && !keepVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 60
      }}
    />
  );
}
