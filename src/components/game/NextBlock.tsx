import React from 'react';
import { motion } from 'framer-motion';

interface NextBlockProps {
  skill: {
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    color: string;
    category: string;
  } | null;
  shape: number[][] | null;
}

const NextBlock: React.FC<NextBlockProps> = ({ skill, shape }) => {
  if (!skill || !shape) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center w-64 h-[280px] flex items-center justify-center">
        <div className="text-gray-500 text-sm">No more blocks</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 w-64 h-[280px] flex flex-col"
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-3">
        <h3 className="text-lg font-semibold text-center text-gray-800">Next Block</h3>
      </div>
      
      {/* Block Preview - Centered and properly sized */}
      <div className="flex-1 flex items-center justify-center mb-3">
        <div className="relative bg-gray-50 rounded-md p-3 border border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-0.5">
            {shape.map((row, y) => (
              <div key={y} className="flex space-x-0.5">
                {row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`${skill.color} border border-white w-4 h-4 rounded-sm shadow-sm`}
                    style={{ 
                      opacity: cell ? 1 : 0
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Skill Info - Fixed at bottom */}
      <div className="flex-shrink-0">
        <div className={`${skill.color} p-3 rounded-lg text-white text-center shadow-md hover:shadow-lg transition-all duration-300`}>
          <div className="flex flex-col items-center space-y-1">
            <div className="text-lg">
              <skill.icon size={20} />
            </div>
            <div className="font-semibold text-sm">{skill.name}</div>
            <div className="text-xs opacity-90">{skill.category}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NextBlock;
