'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface AnimatedNameBoxProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedNameBox = React.memo(function AnimatedNameBox({ children, className = '' }: AnimatedNameBoxProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(startAnimation, 750);
    return () => clearTimeout(timer);
  }, [startAnimation]);

  const animate = useCallback(() => {
    const duration = 1500; // 1.5 seconds for the select animation
    const startTime = Date.now();

    const animateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateFrame);
      }
    };

    animationRef.current = requestAnimationFrame(animateFrame);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animate]);

  return (
    <div 
      ref={containerRef}
      className={`inline-block relative ${className}`}
    >
      {/* Selection box that grows from top-left to bottom-right */}
      {isAnimating && (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: '0',
            top: '0',
            width: `${animationProgress * 100}%`,
            height: `${animationProgress * 100}%`,
            background: 'rgba(251, 191, 36, 0.3)',
            border: '2px solid rgba(251, 191, 36, 0.8)',
            borderRadius: '4px',
            zIndex: 1,
            transition: 'all 0.05s ease-out',
          }}
        />
      )}
      
      {/* Arrow cursor that follows the expanding selection box */}
      {isAnimating && (
        <div 
          className="absolute pointer-events-none"
          style={{
            left: `${animationProgress * 100}%`,
            top: `${animationProgress * 100}%`,
            transform: 'translate(-20%, -20%)',
            zIndex: 15,
            transition: 'all 0.05s ease-out',
          }}
        >
          {/* Arrow cursor pointing towards center (like a cursor) */}
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M12 17L7 7L17 7Z" 
              fill="#fbbf24"
            />
          </svg>
        </div>
      )}
      
      {/* Final static selection box that stays after animation */}
      {isAnimating && animationProgress >= 1 && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(251, 191, 36, 0.2)',
            border: '2px solid rgba(251, 191, 36, 0.6)',
            borderRadius: '4px',
            zIndex: 1,
          }}
        />
      )}
      
      {/* Text content on top */}
      <span className="relative z-10">
        {children}
      </span>
    </div>
  );
});

export default AnimatedNameBox;
