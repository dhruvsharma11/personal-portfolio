import React, { useRef, useEffect } from 'react';
import TetrisBlock from './TetrisBlock';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

interface TetrisBlockData {
  id: string;
  shape: number[][];
  color: string;
  skill: Skill;
  x: number;
  y: number;
}

interface GameBoardProps {
  currentBlock: TetrisBlockData | null;
  placedBlocks: { [key: string]: TetrisBlockData };
  blockSize: number;
  isPlaying: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClick: () => void;
  onResize: (width: number, height: number) => void;
  boardWidth?: number;
  boardHeight?: number;
}

export default function GameBoard({
  currentBlock,
  placedBlocks,
  blockSize,
  isPlaying,
  onKeyDown,
  onClick,
  onResize,
  boardWidth = 0,
  boardHeight = 0
}: GameBoardProps) {
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Calculate perfect canvas dimensions that are exactly divisible by block size
  const perfectCanvasWidth = boardWidth * blockSize;
  const perfectCanvasHeight = boardHeight * blockSize;

  // Handle canvas resizing
  useEffect(() => {
    const handleResize = () => {
      if (gameAreaRef.current) {
        // Get the parent container's available space, not the current canvas size
        const parentContainer = gameAreaRef.current.parentElement;
        if (parentContainer) {
          const parentRect = parentContainer.getBoundingClientRect();
          console.log('📐 PARENT CONTAINER SIZE:', parentRect.width, '×', parentRect.height);
          onResize(parentRect.width, parentRect.height);
        }
      }
    };

    // Initial size
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Use ResizeObserver for more accurate sizing
    if (gameAreaRef.current) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(gameAreaRef.current.parentElement || gameAreaRef.current);
      
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onResize]);

  // Auto-focus when component mounts and when game starts
  useEffect(() => {
    const focusGameArea = () => {
      if (gameAreaRef.current) {
        gameAreaRef.current.focus();
        console.log('Game area focused!');
      }
    };

    // Focus immediately
    focusGameArea();

    // Also focus after a short delay to ensure it works
    const timer = setTimeout(focusGameArea, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Focus when game starts playing
  useEffect(() => {
    if (isPlaying && gameAreaRef.current) {
      const timer = setTimeout(() => {
        gameAreaRef.current?.focus();
        console.log('Game started - focusing game area!');
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying]);

  return (
          <div 
        ref={gameAreaRef}
        className="bg-white relative outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer overflow-hidden"
        onKeyDown={onKeyDown}
        onClick={onClick}
        tabIndex={0}
        style={{
          width: `${perfectCanvasWidth}px`,
          height: `${perfectCanvasHeight}px`,
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: `${blockSize}px ${blockSize}px`,
          backgroundPosition: '0 0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.5)'
        }}
      >
              {/* Game board container */}
        <div 
          className="absolute inset-0 bg-gray-900"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ffffff 1px, transparent 1px),
              linear-gradient(to bottom, #ffffff 1px, transparent 1px)
            `,
            backgroundSize: `${blockSize}px ${blockSize}px`,
            backgroundPosition: '0 0',
            width: '100%',
            height: '100%'
          }}
        />
      
      {/* Placed blocks */}
      {Object.values(placedBlocks).map((block) => (
        <div key={block.id}>
          {block.shape.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <div
                  key={`${block.id}-${x}-${y}`}
                  className="absolute"
                  style={{
                    left: `${(block.x + x) * blockSize}px`,
                    top: `${(block.y + y) * blockSize}px`,
                  }}
                >
                  <TetrisBlock
                    color={block.color}
                    skillName={block.skill.name}
                    size={blockSize}
                  />
                </div>
              ) : null
            )
          )}
        </div>
      ))}

      {/* Current block */}
      {currentBlock && (
        <div>
          {currentBlock.shape.map((row, y) =>
            row.map((cell, x) =>
              cell ? (
                <div
                  key={`current-${x}-${y}`}
                  className="absolute"
                  style={{
                    left: `${(currentBlock.x + x) * blockSize}px`,
                    top: `${(currentBlock.y + y) * blockSize}px`,
                  }}
                >
                  <TetrisBlock
                    color={currentBlock.color}
                    skillName={currentBlock.skill.name}
                    isCurrent={true}
                    size={blockSize}
                  />
                </div>
              ) : null
            )
          )}
        </div>
      )}
    </div>
  );
}
