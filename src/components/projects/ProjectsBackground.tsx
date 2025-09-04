'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  connections: number[];
  life: number;
  maxLife: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  life: number;
  maxLife: number;
}

export default function ProjectsBackground() {
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
    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const maxNodes = 15;
    const maxConnections = 25;
    
    // Create initial nodes
    const createNode = () => {
      const node: Node = {
        x: Math.random() * (canvas.width - 256) + 256, // Only in main content area
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        connections: [],
        life: 1,
        maxLife: Math.random() * 1000 + 500,
      };
      nodes.push(node);
    };

    // Create connection between nearby nodes
    const createConnection = (fromIndex: number, toIndex: number) => {
      const connection: Connection = {
        from: fromIndex,
        to: toIndex,
        strength: Math.random() * 0.5 + 0.5,
        life: 1,
        maxLife: Math.random() * 800 + 400,
      };
      connections.push(connection);
    };

    // Initialize nodes
    for (let i = 0; i < maxNodes; i++) {
      createNode();
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodes.forEach((node, index) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.life++;

        // Bounce off edges
        if (node.x <= 256 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        // Keep nodes in bounds
        node.x = Math.max(256, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));

        // Remove old nodes and create new ones
        if (node.life > node.maxLife) {
          nodes.splice(index, 1);
          createNode();
        }
      });

      // Clear old connections
      connections.splice(0, connections.length);

      // Create new connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.sqrt(
            Math.pow(nodes[i].x - nodes[j].x, 2) + 
            Math.pow(nodes[i].y - nodes[j].y, 2)
          );
          
          if (distance < 120 && connections.length < maxConnections) {
            createConnection(i, j);
          }
        }
      }

      // Draw connections
      connections.forEach(connection => {
        const from = nodes[connection.from];
        const to = nodes[connection.to];
        
        if (from && to) {
          const distance = Math.sqrt(
            Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2)
          );
          
          const alpha = Math.max(0, 1 - distance / 120) * 0.3;
          
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#6366F1';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
          ctx.restore();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.save();
        
        // Create gradient for nodes
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.size
        );
        gradient.addColorStop(0, '#8B5CF6');
        gradient.addColorStop(1, '#6366F1');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = '#8B5CF6';
        ctx.shadowBlur = 8;
        ctx.fill();
        
        ctx.restore();
      });

      // Draw subtle grid overlay
      ctx.save();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.03)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 256; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(256, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
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
