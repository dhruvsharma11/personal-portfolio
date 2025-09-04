'use client';

import React from 'react';
import { useTypewriter } from './TypewriterProvider';

const TypewriterText = React.memo(function TypewriterText() {
  const { currentText } = useTypewriter();

  return (
    <span className="text-sm text-black">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
});

export default TypewriterText;
