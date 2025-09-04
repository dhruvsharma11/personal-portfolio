'use client';

import { useState, useCallback, lazy, Suspense } from 'react';
import Sidebar from '@/components/common/Sidebar';
import { HiMagnifyingGlass } from "react-icons/hi2";

// Lazy load the ResumeViewer for better performance
const ResumeViewer = lazy(() => import('./ResumeViewer'));

// Memoized social media icons
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ContactContent = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const handleResumeOpen = useCallback(() => {
    setIsResumeOpen(true);
  }, []);

  const handleResumeClose = useCallback(() => {
    setIsResumeOpen(false);
  }, []);

  return (
    <div className="flex h-screen bg-transparent relative">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex items-center justify-center px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            Contact
          </h1>
          
          {/* Introductory Text */}
          <p className="text-xl text-gray-700 mb-12 max-w-lg mx-auto">
            If you&apos;re building in AI or just wanna chat, connect with me below!
          </p>
          
          {/* Resume Preview Button */}
          <div className="mb-8">
            <div className="inline-flex items-center bg-white border border-gray-300 rounded-lg p-1 shadow-sm">
              <div className="flex items-center gap-4 px-6 py-4">
                {/* Text */}
                <span className="text-gray-900 font-medium">
                  Preview my resume for more info
                </span>
              </div>
              
              {/* Sleek View Button */}
              <button 
                onClick={handleResumeOpen}
                className="bg-black text-white p-3 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
                type="button"
              >
                <HiMagnifyingGlass className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Connect with me</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="https://www.linkedin.com/in/dhruv-sharma98/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
              
              <a
                href="https://github.com/dhruvsharma11"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <GithubIcon />
                GitHub
              </a>
              
              <a
                href="mailto:d98sharm@uwaterloo.ca"
                className="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <MailIcon />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Viewer Modal - Lazy loaded */}
      {isResumeOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resume...</p>
            </div>
          </div>
        }>
          <ResumeViewer 
            isOpen={isResumeOpen} 
            onClose={handleResumeClose} 
          />
        </Suspense>
      )}
    </div>
  );
};

export default ContactContent;
