import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number }>;
  color: string;
}

interface SkillsGridProps {
  skills: Skill[];
}

const SkillsGrid = React.memo(function SkillsGrid({ skills }: SkillsGridProps) {
  // Memoize animation variants
  const itemVariants = useMemo(() => ({
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }), []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced from 0.1 for faster loading
      }
    }
  }), []);

  return (
    <div className="flex-1 overflow-y-auto">
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            variants={itemVariants}
            transition={{ 
              type: "spring",
              stiffness: 120, // Increased for faster animation
              damping: 12 // Reduced for quicker settling
            }}
            className={`${skill.color} p-4 rounded-lg shadow-lg text-white text-center cursor-pointer hover:scale-105 transition-transform overflow-hidden`}
            style={{ margin: '2px' }}
          >
            <div className="text-3xl mb-2 flex justify-center">
              <skill.icon size={32} />
            </div>
            <div className="font-semibold text-center">{skill.name}</div>
            <div className="text-xs opacity-80 text-center">{skill.category}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
});

export default SkillsGrid;
