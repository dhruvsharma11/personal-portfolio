'use client';

import { useEffect, useRef, useState } from 'react';

interface Tile {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  targetAlpha: number;
  trail: Array<{ x: number; y: number; alpha: number; life: number }>;
}

export default function ContactBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

    // Grid settings - more modern spacing
    const gridSize = 60;
    const gridOffset = 30;
    
    // Create tiles
    const tiles: Tile[] = [];
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        const tile: Tile = {
          x: x + gridOffset,
          y: y + gridOffset,
          size: gridSize - 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0,
          targetAlpha: 0,
          trail: []
        };
        tiles.push(tile);
      }
    }

    // Mouse move handler - use window events for better tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw modern grid pattern - subtle dots at intersections
      ctx.fillStyle = '#E5E7EB';
      ctx.globalAlpha = 0.15;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const centerX = x + gridOffset;
          const centerY = y + gridOffset;
          
          // Create subtle dot pattern
          ctx.beginPath();
          ctx.arc(centerX, centerY, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw subtle connecting lines - very thin and transparent
      ctx.strokeStyle = '#F3F4F6';
      ctx.lineWidth = 0.3;
      ctx.globalAlpha = 0.08;

      // Vertical lines - only every other line for cleaner look
      for (let x = 0; x < canvas.width; x += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(x + gridOffset, 0);
        ctx.lineTo(x + gridOffset, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines - only every other line for cleaner look
      for (let y = 0; y < canvas.height; y += gridSize * 2) {
        ctx.beginPath();
        ctx.moveTo(0, y + gridOffset);
        ctx.lineTo(canvas.width, y + gridOffset);
        ctx.stroke();
      }

      // Update and draw tiles
      tiles.forEach(tile => {
        const distance = Math.sqrt(
          Math.pow(mousePos.x - tile.x, 2) + Math.pow(mousePos.y - tile.y, 2)
        );
        
        // Calculate target alpha based on distance
        if (distance < 120) {
          tile.targetAlpha = Math.max(0.15, 1 - distance / 120);
        } else {
          tile.targetAlpha = 0;
        }

        // Smooth alpha transition
        tile.alpha += (tile.targetAlpha - tile.alpha) * 0.08;

        // Add trail effect
        if (tile.alpha > 0.15) {
          tile.trail.push({
            x: tile.x,
            y: tile.y,
            alpha: tile.alpha,
            life: 1
          });
        }

        // Update trail
        for (let i = tile.trail.length - 1; i >= 0; i--) {
          const trailPoint = tile.trail[i];
          trailPoint.life++;
          
          if (trailPoint.life > 25) {
            tile.trail.splice(i, 1);
          }
        }

        // Draw trail with modern rounded corners
        tile.trail.forEach((trailPoint, index) => {
          const trailAlpha = trailPoint.alpha * (1 - index / tile.trail.length) * 0.4;
          ctx.save();
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = tile.color;
          
          // Draw rounded rectangle for trail
          const radius = 4;
          const x = trailPoint.x - tile.size / 2;
          const y = trailPoint.y - tile.size / 2;
          const width = tile.size;
          const height = tile.size;
          
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        });

        // Draw main tile with modern rounded corners
        if (tile.alpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = tile.alpha;
          ctx.fillStyle = tile.color;
          
          // Draw rounded rectangle for main tile
          const radius = 6;
          const x = tile.x - tile.size / 2;
          const y = tile.y - tile.size / 2;
          const width = tile.size;
          const height = tile.size;
          
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
          
          ctx.restore();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        background: '#FAFAFA',
        zIndex: 0
      }}
    />
  );
}
