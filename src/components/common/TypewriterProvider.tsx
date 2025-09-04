'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

interface TypewriterContextType {
  currentText: string;
  isTyping: boolean;
}

const TypewriterContext = createContext<TypewriterContextType | undefined>(undefined);

export function TypewriterProvider({ children }: { children: ReactNode }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping] = useState(true);

  // Memoize phrases array to prevent recreation
  const phrases = useMemo(() => ["Backend Fanatic", "AI Enthusiast", "Agentic Developer"], []);
  const currentPhrase = phrases[currentTextIndex];
  const currentText = currentPhrase.substring(0, currentCharIndex);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentText,
    isTyping
  }), [currentText, isTyping]);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting && currentCharIndex < currentPhrase.length) {
        setCurrentCharIndex(prev => prev + 1);
      } else if (!isDeleting && currentCharIndex === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && currentCharIndex > 0) {
        setCurrentCharIndex(prev => prev - 1);
      } else if (isDeleting && currentCharIndex === 0) {
        setIsDeleting(false);
        setCurrentTextIndex(prev => (prev + 1) % phrases.length);
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timer);
  }, [currentCharIndex, isDeleting, currentTextIndex, currentPhrase.length, phrases.length]);

  return (
    <TypewriterContext.Provider value={contextValue}>
      {children}
    </TypewriterContext.Provider>
  );
}

export function useTypewriter() {
  const context = useContext(TypewriterContext);
  if (context === undefined) {
    throw new Error('useTypewriter must be used within a TypewriterProvider');
  }
  return context;
}
