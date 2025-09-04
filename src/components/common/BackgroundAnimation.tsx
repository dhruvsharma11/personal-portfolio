'use client';

import { useEffect, useRef } from 'react';

interface Raindrop {
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface Splash {
  x: number;
  y: number;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
  }>;
  life: number;
  maxLife: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface BackgroundAnimationProps {
  onWaterLevelReached: () => void;
}

export default function BackgroundAnimation({ onWaterLevelReached }: BackgroundAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const visibilityRef = useRef(true);
  const hasTriggeredFreeze = useRef(false);
  const isAnimating = useRef(true);

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

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibilityRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Animation state
    const raindrops: Raindrop[] = [];
    const splashes: Splash[] = [];
    const ripples: Ripple[] = [];
    
    // Water level tracking
    let waterLevel = canvas.height - 10; // Start at bottom of canvas
    let waterAlpha = 0.1;
    let waterRiseAmount = 0; // Start at 0, will be incremented by raindrops
    let frameCount = 0;

    // Target water level (where the introduction text is)
    const targetWaterLevel = canvas.height * 0.7;

    // Optimized functions
    const createRaindrop = () => {
      if (hasTriggeredFreeze.current) return; // Stop creating raindrops after freeze
      
      raindrops.push({
        x: Math.random() * (canvas.width - 256) + 256,
        y: -20,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2.5 + 2, // Increased speed from 1.2+0.8 to 2.5+2
      });
    };

    const createSplash = (x: number, y: number) => {
      const particles = [];
      for (let i = 0; i < 4; i++) { // Reduced from 6 to 4 for faster processing
        const angle = (Math.PI * 2 * i) / 4;
        const speed = Math.random() * 3 + 2;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() + 1,
          life: 1,
          maxLife: Math.random() * 25 + 20, // Reduced from 40+30 to 25+20 for faster fade
        });
      }
      splashes.push({ x, y, particles, life: 1, maxLife: 35 }); // Reduced from 60 to 35
    };

    const createRipple = (x: number, y: number) => {
      ripples.push({
        x, y,
        radius: 0,
        maxRadius: 6, // Reduced from 8 to 6 for faster completion
        alpha: 0.25, // Increased from 0.2 to 0.25 for better visibility
        life: 1,
        maxLife: 30, // Reduced from 50 to 30 for faster fade
      });
    };

    // Optimized animation loop
    const animate = () => {
      if (!visibilityRef.current || !isAnimating.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      frameCount++;
      
      // Reduce frame rate for performance but keep it smooth
      if (frameCount % 1 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create raindrops at balanced frequency for optimal timing
      if (Math.random() < 0.2 && !hasTriggeredFreeze.current) { // Increased from 0.15 to 0.2 for balanced timing
        createRaindrop();
      }

      // Update raindrops
      for (let i = raindrops.length - 1; i >= 0; i--) {
        const drop = raindrops[i];
        drop.y += drop.speed;

        if (drop.y >= waterLevel) {
          waterRiseAmount += 1.6; // Middle ground: increased from 1.2 to 1.6 for balanced timing
          createSplash(drop.x, drop.y);
          createRipple(drop.x, drop.y);
          raindrops.splice(i, 1);
          continue;
        }

        if (drop.y > canvas.height + 50) {
          raindrops.splice(i, 1);
          continue;
        }

        // Simple circle drawing
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 1.2; // Increased from 0.8 to 1.2 for faster expansion
        ripple.alpha *= 0.95; // Increased decay from 0.98 to 0.95 for faster fade
        ripple.life++;

        if (ripple.life > ripple.maxLife || ripple.radius > ripple.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = ripple.alpha;
        ctx.strokeStyle = '#4682B4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Update splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];

        for (let j = splash.particles.length - 1; j >= 0; j--) {
          const particle = splash.particles[j];
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vy += 0.15; // Increased from 0.1 to 0.15 for faster fall
          particle.life++;

          if (particle.life > particle.maxLife) {
            splash.particles.splice(j, 1);
            continue;
          }

          const alpha = 1 - (particle.life / particle.maxLife);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#B0E0E6';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        splash.life++;
        if (splash.life > splash.maxLife || splash.particles.length === 0) {
          splashes.splice(i, 1);
        }
      }

      // Draw water with wavy top edge
      waterLevel -= waterRiseAmount; // Decrease water level (water rises from bottom)
      waterRiseAmount = 0;
      waterAlpha = Math.min(0.5, waterAlpha + 0.005); // Increased from 0.002 to 0.005 for faster growth
      
      if (waterAlpha > 0.05) {
        ctx.save();
        ctx.globalAlpha = waterAlpha;
        ctx.fillStyle = '#87CEEB';
        
        // Create wavy water top edge
        ctx.beginPath();
        ctx.moveTo(256, waterLevel);
        
        // Draw wavy top edge
        for (let x = 256; x <= canvas.width; x += 3) {
          const waveOffset = Math.sin(x * 0.015 + frameCount * 0.08) * 4; // Reduced wave amplitude from 8 to 4 and frequency from 0.02 to 0.015
          const y = waterLevel + waveOffset;
          ctx.lineTo(x, y);
        }
        
        // Complete the water shape
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(256, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Check if water has reached the target level for ice freeze
      if (waterLevel <= targetWaterLevel && !hasTriggeredFreeze.current) {
        hasTriggeredFreeze.current = true;
        onWaterLevelReached();
        // Stop the animation completely
        isAnimating.current = false;
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onWaterLevelReached]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 50
      }}
    />
  );
}
