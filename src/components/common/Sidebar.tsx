'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TypewriterText from './TypewriterText';

// Icons for navigation - Memoized to prevent re-creation
const HomeIcon = React.memo(() => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
));

const ExperienceIcon = React.memo(() => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
));

const ProjectsIcon = React.memo(() => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
));

const ContactIcon = React.memo(() => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
));

const ToolsIcon = React.memo(() => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
));

// Social media icons - Memoized
const LinkedInIcon = React.memo(() => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
));

const GithubIcon = React.memo(() => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
));

const MailIcon = React.memo(() => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
));

const ExternalLinkIcon = React.memo(() => (
  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
  </svg>
));

const Sidebar = React.memo(function Sidebar() {
  const pathname = usePathname();

  // Memoize navigation items to prevent re-creation
  const navigationItems = useMemo(() => [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Experience', href: '/experience', icon: ExperienceIcon },
    { name: 'Projects', href: '/projects', icon: ProjectsIcon },
    { name: 'Tools', href: '/tools', icon: ToolsIcon },
    { name: 'Contact', href: '/contact', icon: ContactIcon },
  ], []);

  // Memoize social links
  const socialLinks = useMemo(() => [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/dhruv-sharma98/', icon: LinkedInIcon },
    { name: 'Github', href: 'https://github.com/dhruvsharma11', icon: GithubIcon },
    { name: 'Mail', href: 'mailto:d98sharm@uwaterloo.ca', icon: MailIcon },
  ], []);

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-100 text-black flex flex-col">
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          {/* Profile Picture - Smaller */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img 
              src="/profile/profile-picture.jpg" 
              alt="Dhruv Sharma" 
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const sibling = target.nextElementSibling as HTMLElement;
                if (sibling) {
                  sibling.style.display = 'flex';
                }
              }}
            />
            <div className="w-full h-full bg-gray-300 flex items-center justify-center" style={{display: 'none'}}>
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Name and Typewriter */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-black">Dhruv</h1>
            <TypewriterText />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="h-px bg-gray-300 mx-6 mb-6"></div>

      {/* Navigation Links */}
      <nav className="px-6 mb-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  prefetch={true}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-black hover:bg-gray-200'
                  }`}
                >
                  <Icon />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Social Media Section - Moved up for better visibility */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-semibold text-black mb-4">Connect</h3>
        <ul className="space-y-2">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <a
                  href={item.href}
                  target={item.name === 'Mail' ? '_self' : '_blank'}
                  rel={item.name === 'Mail' ? '' : 'noopener noreferrer'}
                  className="flex items-center justify-between px-3 py-2 text-black hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <ExternalLinkIcon />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
});

export default Sidebar;
