import React from 'react';
import { motion } from 'framer-motion';
import { RiResetLeftFill } from "react-icons/ri";
import { LuBlocks } from "react-icons/lu";

interface GameControlsProps {
  isBuildMode: boolean;
  onBuildModeToggle: () => void;
  onBackToSkills: () => void;
  onResetGame: () => void;
}

export default function GameControls({
  isBuildMode,
  onBuildModeToggle,
  onBackToSkills,
  onResetGame
}: GameControlsProps) {
  return (
    <div className="flex justify-center space-x-4 mt-6">
      {!isBuildMode ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBuildModeToggle}
          className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors border border-gray-600 flex items-center gap-2"
        >
          <LuBlocks className="text-lg" />
          Build
        </motion.button>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToSkills}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors border border-gray-600"
          >
            ← Back to Skills
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetGame}
            className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center gap-2 border border-red-600"
          >
            <RiResetLeftFill className="text-lg" />
            Reset Game
          </motion.button>
                     
        </>
      )}
    </div>
  );
}
