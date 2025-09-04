import React from 'react';

interface TetrisBlockProps {
  color: string;
  skillName: string;
  isCurrent?: boolean;
  size?: number;
  position?: { x: number; y: number };
  isEdge?: boolean;
}

const TetrisBlock: React.FC<TetrisBlockProps> = ({ 
  color, 
  skillName, 
  isCurrent = false, 
  size = 16,
  position,
  isEdge = false
}) => {
  // Create abbreviation for skill names to fit in blocks
  const getAbbreviation = (name: string): string => {
    if (name.length <= 2) return name;
    
    // Handle special cases - limit to 2 letters
    if (name === 'TypeScript') return 'TS';
    if (name === 'JavaScript') return 'JS';
    if (name === 'PostgreSQL') return 'PG';
    if (name === 'TailwindCSS') return 'TW';
    if (name === 'Next.js') return 'NX';
    if (name === 'Node.js') return 'ND';
    if (name === 'OpenCV') return 'CV';
    if (name === 'Kubernetes') return 'K8';
    
    // Take first letter of each word or first 2 letters
    const words = name.split(/[\s.-]+/);
    if (words.length > 1) {
      return words.map(word => word[0]).join('').toUpperCase().slice(0, 2);
    }
    
    return name.slice(0, 2).toUpperCase();
  };

  const abbreviation = getAbbreviation(skillName);
  const fontSize = size <= 12 ? '6px' : size <= 16 ? '8px' : '10px';

  // Determine corner radius based on position
  const getCornerRadius = () => {
    if (size <= 12) return '1px';
    if (size <= 16) return '2px';
    return '3px';
  };

  const cornerRadius = getCornerRadius();

  return (
    <div
      className={`${color} border border-white shadow-sm flex items-center justify-center`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: isCurrent ? '2px' : '1px',
        borderRadius: cornerRadius,
        boxShadow: isCurrent ? '0 0 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        className="text-white font-bold leading-none text-center select-none"
        style={{ 
          fontSize,
          lineHeight: '1',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          textAlign: 'center'
        }}
      >
        {abbreviation}
      </div>
    </div>
  );
};

export default TetrisBlock;
