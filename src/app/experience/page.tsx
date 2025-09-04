import { Suspense, lazy } from 'react';
import Sidebar from '@/components/common/Sidebar';
import ExperienceTimeline from '@/components/experience/ExperienceTimeline';

// Lazy load the background animation
const ExperienceBackground = lazy(() => import('@/components/experience/ExperienceBackground'));

export default function Experience() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      {/* Background Animation - Lazy loaded */}
      <Suspense fallback={null}>
        <ExperienceBackground />
      </Suspense>
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 relative z-10">
        <div className="max-w-6xl mx-auto p-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              My Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A timeline of my professional experiences, from my first internship to building 
              cutting-edge AI solutions. Each role has shaped my growth as a software engineer. 
              Currently seeking <span className="font-bold text-blue-600">New Grad 2026</span> opportunities.
            </p>
          </div>
          
          {/* Timeline */}
          <ExperienceTimeline />
        </div>
      </div>
    </div>
  );
}
