import { useState, useEffect, useCallback } from 'react';

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

// Tetris-style block shapes
const tetrisShapes = [
  // I-shape (straight)
  [[1, 1, 1, 1]],
  
  // O-shape (square)
  [[1, 1], [1, 1]],
  
  // T-shape
  [[0, 1, 0], [1, 1, 1]],
  
  // L-shape
  [[1, 0], [1, 0], [1, 1]],
  
  // J-shape
  [[0, 1], [0, 1], [1, 1]],
  
  // S-shape
  [[0, 1, 1], [1, 1, 0]],
  
  // Z-shape
  [[1, 1, 0], [0, 1, 1]],
];

const BLOCK_SIZE = 30;
const DROP_INTERVAL = 1000;

export const useTetrisGame = (skills: Skill[]) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<TetrisBlockData | null>(null);
  const [nextBlock, setNextBlock] = useState<TetrisBlockData | null>(null);
  const [placedBlocks, setPlacedBlocks] = useState<{ [key: string]: TetrisBlockData }>({});
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([...skills]);
  const [usedSkills, setUsedSkills] = useState<Skill[]>([]);
  const [board, setBoard] = useState<number[][]>([]);
  const [dropTimer, setDropTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Dynamic board dimensions based on canvas size - start with reasonable initial size
  const [boardWidth, setBoardWidth] = useState(30);
  const [boardHeight, setBoardHeight] = useState(18);

  const createNewBlock = useCallback((skill: Skill): TetrisBlockData => {
    const randomShape = tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)];
    return {
      id: `${skill.id}-${Date.now()}`,
      shape: randomShape,
      color: skill.color,
      skill: skill,
      x: Math.floor(boardWidth / 2) - Math.floor(randomShape[0].length / 2),
      y: 0
    };
  }, [boardWidth]);

  const canPlaceBlock = useCallback((block: TetrisBlockData): boolean => {
    for (let y = 0; y < block.shape.length; y++) {
      for (let x = 0; x < block.shape[y].length; x++) {
        if (block.shape[y][x]) {
          const boardX = block.x + x;
          const boardY = block.y + y;
          
          // Check boundaries - allow blocks to reach the very bottom and right edges
          if (boardX < 0 || boardX >= boardWidth || boardY < 0 || boardY >= boardHeight) {
            return false;
          }
          
          // Check if position is already occupied
          if (board[boardY] && board[boardY][boardX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board, boardWidth, boardHeight]);

  const placeBlock = useCallback((block: TetrisBlockData) => {
    if (!canPlaceBlock(block)) return false;

    // Update board
    const newBoard = [...board];
    for (let y = 0; y < block.shape.length; y++) {
      for (let x = 0; x < block.shape[y].length; x++) {
        if (block.shape[y][x]) {
          newBoard[block.y + y][block.x + x] = 1;
        }
      }
    }
    setBoard(newBoard);

    // Add to placed blocks
    setPlacedBlocks(prev => ({
      ...prev,
      [block.id]: block
    }));

    // Add skill to used skills when it's placed
    setUsedSkills(prev => [...prev, block.skill]);

    return true;
  }, [board, canPlaceBlock]);

  // Helper function to handle next block creation
  const createNextBlock = useCallback(() => {
    if (nextBlock) {
      // Move next block to current
      const newCurrentBlock = { ...nextBlock, y: 0 };
      setCurrentBlock(newCurrentBlock);
      
      // Create new next block from remaining skills
      setAvailableSkills(prevSkills => {
        const remainingSkills = prevSkills.filter(s => s.id !== nextBlock.skill.id);
        if (remainingSkills.length > 0) {
          const newNextSkill = remainingSkills[0];
          const newNextBlock = createNewBlock(newNextSkill);
          setNextBlock(newNextBlock);
          return remainingSkills;
        } else {
          // If no more available skills, cycle back to used skills
          if (usedSkills.length > 0) {
            setAvailableSkills([...usedSkills]);
            setUsedSkills([]);
            const newNextSkill = usedSkills[0];
            const newNextBlock = createNewBlock(newNextSkill);
            setNextBlock(newNextBlock);
            return [newNextSkill];
          } else {
            setNextBlock(null);
            return [];
          }
        }
      });
    } else if (availableSkills.length > 0) {
      // If no next block but we have available skills, create one
      const newSkill = availableSkills[0];
      const newBlock = createNewBlock(newSkill);
      setCurrentBlock(newBlock);
      
      // Create next block if there are more skills
      if (availableSkills.length > 1) {
        const nextSkill = availableSkills[1];
        const nextBlockData = createNewBlock(nextSkill);
        setNextBlock(nextBlockData);
      }
      
      // Remove the skill we just used
      setAvailableSkills(prev => prev.filter(s => s.id !== newSkill.id));
    }
  }, [nextBlock, availableSkills, usedSkills, createNewBlock]);

  const moveBlock = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentBlock || !isPlaying) return;

    const newBlock = { ...currentBlock };
    switch (direction) {
      case 'left':
        newBlock.x = Math.max(0, newBlock.x - 1);
        break;
      case 'right':
        // Ensure blocks can move to the very right edge
        const maxRight = boardWidth - newBlock.shape[0].length;
        newBlock.x = Math.min(maxRight, newBlock.x + 1);
        break;
      case 'down':
        newBlock.y = Math.min(boardHeight - newBlock.shape.length, newBlock.y + 1);
        break;
    }

    if (canPlaceBlock(newBlock)) {
      setCurrentBlock(newBlock);
    } else if (direction === 'down') {
      // If we can't move down, the block should be placed
      const placed = placeBlock(currentBlock);
      if (placed) {
        setCurrentBlock(null);
        // Create next block - use setTimeout to prevent race conditions
        setTimeout(() => createNextBlock(), 0);
      }
    }
  }, [currentBlock, canPlaceBlock, isPlaying, boardWidth, boardHeight, placeBlock, createNextBlock]);

  const rotateBlock = useCallback(() => {
    if (!currentBlock || !isPlaying) return;

    const rotated = currentBlock.shape[0].map((_, i) => 
      currentBlock.shape.map(row => row[i]).reverse()
    );

    const newBlock = { ...currentBlock, shape: rotated };
    if (canPlaceBlock(newBlock)) {
      setCurrentBlock(newBlock);
    }
  }, [currentBlock, canPlaceBlock, isPlaying]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isPlaying || !currentBlock) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveBlock('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveBlock('right');
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveBlock('down');
        break;
      case ' ':
        e.preventDefault();
        rotateBlock();
        break;
      case 'Enter':
        e.preventDefault();
        // Drop block to bottom
        if (currentBlock) {
          const dropBlock = { ...currentBlock };
          while (canPlaceBlock({ ...dropBlock, y: dropBlock.y + 1 })) {
            dropBlock.y += 1;
          }
                       if (placeBlock(dropBlock)) {
               setCurrentBlock(null);
               // Create next block - use setTimeout to prevent race conditions
               setTimeout(() => createNextBlock(), 0);
             }
        }
        break;
    }
  }, [isPlaying, currentBlock, moveBlock, rotateBlock, placeBlock, canPlaceBlock, createNextBlock]);

  const startGame = useCallback(() => {
    // Reset game state
    setIsPlaying(true);
    setPlacedBlocks({});
    setBoard(Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(0)));
    setAvailableSkills([...skills]);
    
    // Debug logging for game start
    console.log('🚀 GAME STARTED - INITIAL DIMENSIONS:');
    console.log(`📊 Board size: ${boardWidth} × ${boardHeight} blocks`);
    console.log(`🔲 Block size: ${BLOCK_SIZE}px`);
    console.log(`✨ Total canvas area: ${boardWidth * BLOCK_SIZE}px × ${boardHeight * BLOCK_SIZE}px`);
    console.log(`🎯 Available skills: ${skills.length}`);
    
    // Create first block
    const firstSkill = skills[0];
    const firstBlock = createNewBlock(firstSkill);
    setCurrentBlock(firstBlock);
    
    // Create next block
    const secondSkill = skills[1];
    const nextBlockData = createNewBlock(secondSkill);
    setNextBlock(nextBlockData);
  }, [createNewBlock, boardWidth, boardHeight, skills]);

  // Auto-drop timer effect
  useEffect(() => {
    if (!isPlaying || !currentBlock) return;

    const timer = setInterval(() => {
      setCurrentBlock(prevBlock => {
        if (!prevBlock) return null;
        
        const newBlock = { ...prevBlock, y: prevBlock.y + 1 };
        
        if (canPlaceBlock(newBlock)) {
          return newBlock;
        } else {
          // Block can't move down, place it
          const placed = placeBlock(prevBlock);
          
          if (placed) {
            // Create next block - use setTimeout to prevent race conditions
            setTimeout(() => createNextBlock(), 0);
          }
          
          return null;
        }
      });
    }, DROP_INTERVAL);

    setDropTimer(timer);
    return () => clearInterval(timer);
  }, [isPlaying, currentBlock, placeBlock, canPlaceBlock, createNextBlock]);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setPlacedBlocks({});
    setBoard(Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(0)));
    setAvailableSkills([...skills]);
    setUsedSkills([]);
    setCurrentBlock(null);
    setNextBlock(null);
    
    // Clear any existing timers
    if (dropTimer) {
      clearInterval(dropTimer);
      setDropTimer(null);
    }
  }, [dropTimer, boardWidth, boardHeight, skills]);

  // Initialize board when dimensions change
  useEffect(() => {
    setBoard(Array(boardHeight).fill(null).map(() => Array(boardWidth).fill(0)));
  }, [boardWidth, boardHeight]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dropTimer) {
        clearInterval(dropTimer);
      }
    };
  }, [dropTimer]);

  const updateBoardDimensions = useCallback((width: number, height: number) => {
    // Calculate board dimensions to maximize canvas size while maintaining perfect block alignment
    // Ensure the canvas fits within the available space without getting cut off
    
    // For width: Use the full available width, but ensure minimum of 20 blocks for good gameplay
    const maxWidth = Math.floor(width / BLOCK_SIZE);
    const newWidth = Math.max(maxWidth, 20); // Minimum 20 blocks wide for better gameplay
    
    // Reserve space for buttons and other UI elements (approximately 200px)
    const reservedHeight = 200;
    const availableHeight = height - reservedHeight;
    const maxHeight = Math.floor(availableHeight / BLOCK_SIZE);
    const newHeight = Math.max(maxHeight, 18); // Minimum 18 blocks tall
    
    // Calculate the actual canvas size that will be used
    const actualCanvasWidth = newWidth * BLOCK_SIZE;
    const actualCanvasHeight = newHeight * BLOCK_SIZE;
    
    // Debug logging to show exact dimensions
    console.log('🎯 CANVAS DIMENSION DEBUG:');
    console.log(`📏 Raw canvas size: ${width}px × ${height}px`);
    console.log(`🔲 Block size: ${BLOCK_SIZE}px`);
    console.log(`📐 Reserved height for UI: ${reservedHeight}px`);
    console.log(`📐 Available height for canvas: ${availableHeight}px`);
    console.log(`📊 Calculated board: ${newWidth} × ${newHeight} blocks`);
    console.log(`✨ Perfect canvas size: ${actualCanvasWidth}px × ${actualCanvasHeight}px`);
    console.log(`🎮 Target: Canvas fits within viewport with space for buttons`);
    
    if (newWidth !== boardWidth || newHeight !== boardHeight) {
      console.log(`🔄 Updating board dimensions from ${boardWidth}×${boardHeight} to ${newWidth}×${newHeight}`);
      setBoardWidth(newWidth);
      setBoardHeight(newHeight);
      setBoard(Array(newHeight).fill(null).map(() => Array(newWidth).fill(0)));
    }
  }, [boardWidth, boardHeight]);

  return {
    // Game state
    isPlaying,
    currentBlock,
    nextBlock,
    placedBlocks,
    availableSkills,
    board,
    boardWidth,
    boardHeight,
    BLOCK_SIZE,
    
    // Game actions
    startGame,
    resetGame,
    moveBlock,
    rotateBlock,
    handleKeyDown,
    
    // Board dimensions
    updateBoardDimensions,
  };
};
