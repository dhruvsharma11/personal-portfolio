'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  githubLink: string;
  technologies: string[];
}

// Memoized GitHub icon
const GithubIcon = React.memo(function GithubIcon() {
  return (
    <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
});

const ProjectCard = React.memo(function ProjectCard({ title, description, image, githubLink, technologies }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = useCallback(() => {
    window.open(githubLink, '_blank', 'noopener,noreferrer');
  }, [githubLink]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:border-blue-300 h-[500px] flex flex-col cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
    >
      {/* Image Container - Fixed height */}
      <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className={`object-contain transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* GitHub Link Button */}
        <div className={`absolute top-4 right-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <div className="inline-flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <GithubIcon />
          </div>
        </div>
      </div>

      {/* Content - Flex grow to fill remaining space */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed flex-1">
          {description}
        </p>

        {/* Technologies - Fixed at bottom */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {technologies.map((tech, index) => (
            <span
              key={`${title}-${tech}-${index}`}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${
                isHovered 
                  ? 'bg-blue-100 text-blue-800 scale-105' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-500 ${
        isHovered ? 'border-blue-400/30' : ''
      }`} />
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-purple-400/0 transition-opacity duration-500 ${
        isHovered ? 'opacity-100' : ''
      }`} />
    </div>
  );
});

export default ProjectCard;
