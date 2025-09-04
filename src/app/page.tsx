'use client';

import { Suspense, lazy, useState, useCallback } from 'react';
import Sidebar from '@/components/common/Sidebar';
import AnimatedNameBox from '@/components/common/AnimatedNameBox';
import FloatingRingsAnimation from '@/components/common/FloatingRingsAnimation';

// Lazy load the heavy background animation
const BackgroundAnimation = lazy(() => import('@/components/common/BackgroundAnimation'));

export default function Home() {
  const [showRingsAnimation, setShowRingsAnimation] = useState(false);
  const [showIntroduction, setShowIntroduction] = useState(false);
  const [ringsCompleted, setRingsCompleted] = useState(false);

  const handleWaterLevelReached = () => {
    setShowRingsAnimation(true);
  };

  const handleRingsComplete = useCallback(() => {
    setShowIntroduction(true);
    setRingsCompleted(true);
    // Keep rings visible but stop the animation
    setShowRingsAnimation(false);
  }, []);

  return (
    <div className="flex h-screen relative bg-white">
      {/* Background Animation - Lazy loaded */}
      <Suspense fallback={null}>
        <BackgroundAnimation onWaterLevelReached={handleWaterLevelReached} />
      </Suspense>
      
      {/* Floating Rings Animation - Keep visible after completion */}
      {(showRingsAnimation || ringsCompleted) && (
        <FloatingRingsAnimation 
          isActive={showRingsAnimation} 
          onRingsComplete={handleRingsComplete}
          keepVisible={ringsCompleted}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 relative z-10">
        <div className="max-w-4xl mx-auto relative z-20 text-center" style={{ 
          position: 'absolute', 
          top: '60%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '100%'
        }}>
          {/* Main Heading - Starts centered, moves up when introduction appears */}
          <div className={`mb-2 transition-all duration-1000 ease-out transform ${
            showIntroduction 
              ? 'transform -translate-y-32 opacity-90' 
              : 'transform translate-y-0 opacity-100'
          }`}>
            <span className="text-5xl font-bold text-gray-900">Hey, I&apos;m </span>
            <AnimatedNameBox className="text-5xl font-bold text-gray-900">
              Dhruv
            </AnimatedNameBox>
          </div>
          
          {/* Subtitle - Starts centered, moves up when introduction appears */}
          <div className={`flex items-center justify-center gap-2 mb-2 transition-all duration-1000 ease-out transform ${
            showIntroduction 
              ? 'transform -translate-y-32 opacity-90' 
              : 'transform translate-y-0 opacity-100'
          }`}>
            <h2 className="text-5xl font-bold text-gray-600">
              AI Engineer
            </h2>
          </div>
          
          {/* Introduction - Always rendered but hidden until needed */}
          <div className={`transition-all duration-1000 ease-out transform ${
            showIntroduction 
              ? 'opacity-100 -translate-y-26' 
              : 'opacity-0 translate-y-16 pointer-events-none'
          }`}>
            <p className="text-lg text-gray-700 mb-4 text-center max-w-2xl mx-auto">
              I turn complex challenges into scalable, intelligent AI solutions. 
              Passionate about building innovative systems that drive real-world impact.
            </p>

            {/* Current Role - Bigger box so text fits on one line */}
            <div className="bg-white/90 border border-gray-200 rounded-lg p-4 mb-4 shadow-lg max-w-2xl mx-auto">
              <p className="text-gray-700 text-center">
              Currently working as a <span className="font-bold text-gray-900">Software Engineer</span> at{" "}
              <a
                href="https://www.goaugment.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center underline cursor-pointer hover:text-blue-600"
              >
                Augment
                <img
                  src="/logos/logo.svg"
                  alt="Augment logo"
                  className="w-9 h-9 ml-3"
                  loading="lazy"
                />
              </a> 
            </p>
            </div>

            {/* Education & Interests */}
            <div className="mb-6 text-center">
              <p className="text-gray-700 mb-2">
                Studying <span>Management Engineering</span> at{" "}
                <span className="inline-flex items-center font-bold">
                  University of Waterloo
                </span>
              </p>
            </div>

            {/* Experience Summary */}
            <div className="mb-8 text-center">
              <p className="text-gray-700">
                I&apos;ve had <span className="font-bold">6 past internships</span> ranging from Software Engineer to Machine Learning to AI Engineer roles. 
                Currently seeking <span className="font-bold">New Grad 2026</span> opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
