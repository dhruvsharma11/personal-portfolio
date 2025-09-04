'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/common/Sidebar';
import NextBlock from '@/components/game/NextBlock';
import GameBoard from '@/components/game/GameBoard';
import SkillsGrid from '@/components/common/SkillsGrid';
import GameControls from '@/components/game/GameControls';
import { useTetrisGame } from '@/hooks/useTetrisGame';
import { 
  SiPython, SiJavascript, SiTypescript, SiMysql, SiGraphql, SiHtml5, SiCss3,
  SiNodedotjs, SiReact, SiNextdotjs, SiExpress, SiTailwindcss, SiFlask, SiNumpy, SiOpencv,
   SiDocker, SiKubernetes, SiGit, SiLinux, SiPostgresql
} from 'react-icons/si';
import { FaJava } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";
import { FaAws } from "react-icons/fa";
import { VscAzure } from "react-icons/vsc";
import { BsCursorFill } from "react-icons/bs";
import { motion } from 'framer-motion';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

const skills: Skill[] = [
  // Languages
  { id: 'python', name: 'Python', category: 'Languages', icon: SiPython, color: 'bg-yellow-500' },
  { id: 'javascript', name: 'JavaScript', category: 'Languages', icon: SiJavascript, color: 'bg-yellow-400' },
  { id: 'typescript', name: 'TypeScript', category: 'Languages', icon: SiTypescript, color: 'bg-blue-600' },
  { id: 'sql', name: 'SQL', category: 'Languages', icon: SiMysql, color: 'bg-blue-500' },
  { id: 'graphql', name: 'GraphQL', category: 'Languages', icon: SiGraphql, color: 'bg-purple-600' },
  { id: 'java', name: 'Java', category: 'Languages', icon: FaJava, color: 'bg-orange-600' },
  { id: 'csharp', name: 'C#', category: 'Languages', icon: TbBrandCSharp, color: 'bg-purple-500' },
  { id: 'html', name: 'HTML', category: 'Languages', icon: SiHtml5, color: 'bg-orange-500' },
  { id: 'css', name: 'CSS', category: 'Languages', icon: SiCss3, color: 'bg-blue-500' },
  
  // Frameworks/Libraries
  { id: 'nodejs', name: 'Node.js', category: 'Frameworks', icon: SiNodedotjs, color: 'bg-green-600' },
  { id: 'react', name: 'React.js', category: 'Frameworks', icon: SiReact, color: 'bg-blue-500' },
  { id: 'nextjs', name: 'Next.js', category: 'Frameworks', icon: SiNextdotjs, color: 'bg-black' },
  { id: 'express', name: 'Express', category: 'Frameworks', icon: SiExpress, color: 'bg-gray-600' },
  { id: 'tailwind', name: 'TailwindCSS', category: 'Frameworks', icon: SiTailwindcss, color: 'bg-cyan-500' },
  { id: 'flask', name: 'Flask', category: 'Frameworks', icon: SiFlask, color: 'bg-gray-300' },
  { id: 'numpy', name: 'NumPy', category: 'Frameworks', icon: SiNumpy, color: 'bg-blue-400' },
  { id: 'opencv', name: 'OpenCV', category: 'Frameworks', icon: SiOpencv, color: 'bg-green-500' },
  
  // Developer Tools
  { id: 'aws', name: 'AWS', category: 'Tools', icon: FaAws, color: 'bg-orange-500' },
  { id: 'azure', name: 'Azure', category: 'Tools', icon: VscAzure, color: 'bg-blue-600' },
  { id: 'docker', name: 'Docker', category: 'Tools', icon: SiDocker, color: 'bg-blue-500' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Tools', icon: SiKubernetes, color: 'bg-blue-600' },
  { id: 'git', name: 'Git', category: 'Tools', icon: SiGit, color: 'bg-orange-600' },
  { id: 'linux', name: 'Linux', category: 'Tools', icon: SiLinux, color: 'bg-yellow-500' },
  { id: 'mysql', name: 'MySQL', category: 'Tools', icon: SiMysql, color: 'bg-blue-500' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Tools', icon: SiPostgresql, color: 'bg-blue-600' },
  { id: 'cursor', name: 'Cursor', category: 'Tools', icon: BsCursorFill, color: 'bg-purple-600' },
];

export default function Tools() {
  const [isBuildMode, setIsBuildMode] = useState(false);
  
  const {
    // Game state
    isPlaying,
    currentBlock,
    nextBlock,
    placedBlocks,
    BLOCK_SIZE,
    
    // Game actions
    startGame,
    resetGame,
    handleKeyDown,
    
    // Board dimensions
    updateBoardDimensions,
    boardWidth,
    boardHeight,
  } = useTetrisGame(skills);

  const goBackToSkills = useCallback(() => {
    setIsBuildMode(false);
    resetGame();
  }, [resetGame]);

  // Auto-start game when entering build mode
  useEffect(() => {
    if (isBuildMode && !isPlaying) {
      startGame();
    }
  }, [isBuildMode, isPlaying, startGame]);

  const handleGameAreaClick = useCallback(() => {
    // Focus the game area for keyboard controls
    const gameArea = document.querySelector('[tabindex="0"]') as HTMLElement;
    if (gameArea) {
      gameArea.focus();
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64 p-8 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {/* Title - Centered with respect to canvas when in build mode */}
          {!isBuildMode && (
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Skills & Technologies
              </h1>
              <p className="text-lg text-gray-600">
                My technical skills - click 'Build' to start the playground!
              </p>
            </div>
          )}

          {isBuildMode && (
            <div className="text-center mb-6" style={{ marginLeft: '16rem' }}>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Skills & Technologies
              </h1>
              <p className="text-lg text-gray-600">
                Tetris-style skills playground! Build freely and have fun!
              </p>
            </div>
          )}

          {!isBuildMode && (
            <SkillsGrid skills={skills} />
          )}

          {isBuildMode && (
            <div className="flex-1 flex gap-6">
              {/* Left Sidebar - Next Block and Controls Info */}
              <div className="w-64 flex-shrink-0 space-y-4">
                <NextBlock skill={nextBlock?.skill || null} shape={nextBlock?.shape || null} />
                
                {/* Playground Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <motion.span 
                      className="text-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      🎮
                    </motion.span>
                    <span>Playground Controls</span>
                  </div>
                  <div className="text-gray-700 text-xs space-y-1 mb-3">
                    <div className="flex justify-between hover:bg-gray-100 hover:bg-opacity-50 p-1 rounded transition-colors duration-200">
                      <span className="font-mono">← →</span>
                      <span>Move left/right</span>
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 hover:bg-opacity-50 p-1 rounded transition-colors duration-200">
                      <span className="font-mono">↓</span>
                      <span>Move down</span>
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 hover:bg-opacity-50 p-1 rounded transition-colors duration-200">
                      <span className="font-mono">Space</span>
                      <span>Rotate</span>
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 hover:bg-opacity-50 p-1 rounded transition-colors duration-200">
                      <span className="font-mono">Enter</span>
                      <span>Drop instantly</span>
                    </div>
                  </div>
                  <div className="text-gray-700 text-xs pt-2 border-t border-gray-200 space-y-1">
                    <div className="flex justify-between hover:bg-gray-100 hover:bg-opacity-50 p-1 rounded transition-colors duration-200">
                      <span>Blocks:</span>
                      <span className="font-semibold">{Object.keys(placedBlocks).length}</span>
                    </div>
                    <div className="flex justify-between hover:bg-gray-100 hover:bg-opacity-50 p-1 rounded transition-colors duration-200">
                      <span>Next:</span>
                      <span className="font-semibold">{nextBlock?.skill?.name || 'None'}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Area - Game and Controls */}
              <div className="flex-1 flex flex-col items-center space-y-6">
                {/* Game Area */}
                <div className="flex justify-center w-full">
                  <GameBoard
                    currentBlock={currentBlock}
                    placedBlocks={placedBlocks}
                    blockSize={BLOCK_SIZE}
                    isPlaying={isPlaying}
                    onKeyDown={handleKeyDown}
                    onClick={handleGameAreaClick}
                    onResize={updateBoardDimensions}
                    boardWidth={boardWidth}
                    boardHeight={boardHeight}
                  />
                </div>

                {/* Game Controls - Centered below canvas */}
                <div className="flex justify-center">
                  <GameControls
                    isBuildMode={isBuildMode}
                    onBuildModeToggle={() => setIsBuildMode(true)}
                    onBackToSkills={goBackToSkills}
                    onResetGame={resetGame}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Build button - centered when not in build mode */}
          {!isBuildMode && (
            <div className="flex justify-center space-x-4 mt-6">
              <GameControls
                isBuildMode={isBuildMode}
                onBuildModeToggle={() => setIsBuildMode(true)}
                onBackToSkills={goBackToSkills}
                onResetGame={resetGame}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
