'use client';

import { useEffect, useRef, useState } from 'react';

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  highlights: string[];
  skills: string[];
  logo?: string;
  isCurrent?: boolean;
}

const experiences: Experience[] = [
  {
    id: 'augment',
    company: 'Augment',
    position: 'Software Engineer',
    duration: 'Sep 2025 Present',
    location: 'San Francisco, CA',
    description: 'Building Augie, an AI-Agent Teammate for shippers, brokers, and carriers.',
    highlights: [],
    skills: ['React', 'TypeScript', 'Python', 'AI/ML'],
    logo: '/logos/logo.svg',
    isCurrent: true
  },
  {
    id: 'safari',
    company: 'Safari AI',
    position: 'Machine Learning Engineer',
    duration: 'Jan 2025 May 2025',
    location: 'New York, NY',
    description: 'Video Intelligence Platform transforming edge detections into business metrics.',
    highlights: [
      'Fine-tuned Faster R-CNN models on 2,000+ images, improving mAP by 10%',
      'Deployed data-sampling on AWS Sagemaker to reduce ML infrastructure workflow',
      'Containerized sampling jobs with Docker, cutting cloud costs',
      'Built 45+ custom Apache Flink and Pulsar streaming engines'
    ],
    skills: ['Python', 'Computer Vision', 'AWS', 'MLOps', 'Docker'],
    logo: '/experience/safariai.jpeg',
  },
  {
    id: 'onorder',
    company: 'OnOrder - Stealth Startup',
    position: 'Software Engineer',
    duration: 'May 2024 Aug 2024',
    location: 'Toronto, ON',
    description: 'CRM for Kitchen & Bath Showrooms and End-to-End Platform for Interior Designers.',
    highlights: [
      'Implemented RAG model with Langchain and Pinecone, embedding 300,000+ product vectors',
      'Utilized OpenAI LLM Agents to automate product creation',
      'Trained YoloV8 model, annotating 5,000+ images of kitchen and bathroom items',
      'Deployed Flask backend on Railway using Docker'
    ],
    skills: ['LLM', 'Python', 'GraphQL', 'Node.js', 'Next.js', 'TypeScript'],
    logo: '/experience/stealthstartup.jpeg',
  },
  {
    id: 'td-securities',
    company: 'TD Securities',
    position: 'Software Engineer',
    duration: 'Sep 2023 Dec 2023',
    location: 'Toronto, ON',
    description: 'Financial Solution Groups - Corporate Loans and Residential Mortgages.',
    highlights: [
      'Created full-stack interface for residential mortgages with C#, WPF, and MS SQL',
      'Optimized file archiving processes using Python and Shell scripts',
      'Utilized Test-Driven Development (TDD) methodology',
      'Migrated Jenkins Server with 20+ jobs to production'
    ],
    skills: ['C#', 'SQL', '.NET Framework', 'Python', 'Linux'],
    logo: '/experience/td.png',
  },
  {
    id: 'td',
    company: 'TD',
    position: 'Business System Analyst',
    duration: 'Jan 2023 Apr 2023',
    location: 'Toronto, ON',
    description: 'Change Management / Application Onboarding.',
    highlights: [
      'Created dashboards in ServiceNow to analyze Change Management data',
      'Automated Confluence page processes using Power Query',
      'Supported stakeholders with Change Management best practices'
    ],
    skills: ['ServiceNow', 'Power Query', 'Excel', 'Business Process Improvement'],
    logo: '/experience/td.png',
  },
  {
    id: 'loblaw',
    company: 'Loblaw Digital',
    position: 'Software Engineer',
    duration: 'May 2022 Aug 2022',
    location: 'Toronto, ON',
    description: 'Pharmaceutical Ingestion System.',
    highlights: [
      'Resolved incident tickets for microservices on pharmacy app',
      'Applied Excel macros to compare datasets and reduce validation time'
    ],
    skills: ['Shell Scripts', 'SQL', 'Excel', 'Python', 'Linux'],
    logo: '/experience/loblaw.jpg',
  }
];

export default function ExperienceTimeline() {
  const [mostRecentVisible, setMostRecentVisible] = useState<string>('');
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set the current role as the initial highlighted item
    const currentRole = experiences.find(exp => exp.isCurrent);
    if (currentRole) {
      setMostRecentVisible(currentRole.id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the card that's in the optimal reading position
        let bestCard = null;
        let bestScore = -Infinity;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            
            // Calculate how well positioned this card is for reading
            // We want the card to be near the top of the viewport but fully visible
            const cardTop = rect.top;
            const cardHeight = rect.height;
            const cardBottom = rect.bottom;
            
            // Score based on position - higher score for better reading position
            let score = 0;
            
            // Bonus for being fully visible
            if (cardBottom <= viewportHeight && cardTop >= 0) {
              score += 100;
            }
            
            // Bonus for being in the top portion of the viewport (good for reading)
            if (cardTop >= 0 && cardTop <= viewportHeight * 0.3) {
              score += 50;
            }
            
            // Penalty for being too high (above viewport)
            if (cardTop < 0) {
              score -= Math.abs(cardTop);
            }
            
            // Penalty for being too low (below viewport)
            if (cardBottom > viewportHeight) {
              score -= (cardBottom - viewportHeight);
            }
            
            if (score > bestScore) {
              bestScore = score;
              bestCard = entry.target.getAttribute('data-item-id');
            }
          }
        });
        
        if (bestCard && bestScore > 0) {
          setMostRecentVisible(bestCard);
        }
      },
      { threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] }
    );

    const items = timelineRef.current?.querySelectorAll('[data-item-id]');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={timelineRef} className="relative">
      {/* Timeline line */}
      <div className="absolute left-44 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500"></div>
      
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            data-item-id={exp.id}
            className="relative flex items-start transition-all duration-1000"
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            {/* Date and Timeline Container */}
            <div className="flex-shrink-0 flex items-center gap-6">
              {/* Date on the left */}
              <div className="text-right w-36">
                <div className={`whitespace-nowrap ${
                  mostRecentVisible === exp.id 
                    ? 'text-base font-semibold text-gray-800' 
                    : 'text-sm font-medium text-gray-600'
                }`}>
                  {exp.duration.split(' ')[0]} {exp.duration.split(' ')[1]}
                  <span className="text-gray-400 mx-1">–</span>
                  <span className={exp.isCurrent ? 'text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md text-xs font-medium' : ''}>
                    {exp.duration.split(' ').slice(2).join(' ')}
                  </span>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 flex items-center justify-center">
                <div className={`w-5 h-5 rounded-full transition-all duration-500 ${
                  mostRecentVisible === exp.id
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/30 scale-110' 
                    : 'bg-gray-300'
                }`}>
                </div>
              </div>
            </div>

            {/* Content card */}
            <div className="flex-1 ml-8">
              <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 border-l-4 ${
                exp.isCurrent 
                  ? 'border-blue-500 shadow-blue-100' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {exp.logo && (
                      <img 
                        src={exp.logo} 
                        alt={`${exp.company} logo`}
                        className="w-12 h-12 rounded-lg object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-blue-600">
                          {exp.company}
                        </span>
                        {exp.isCurrent && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {/* Highlights - Only show if there are highlights */}
                {exp.highlights && exp.highlights.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-blue-500 flex-shrink-0">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
