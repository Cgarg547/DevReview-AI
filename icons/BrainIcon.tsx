
import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5a3 3 0 1 0-5.993.142"/>
    <path d="M18 5a3 3 0 1 0-5.993.142"/>
    <path d="M12 19a3 3 0 1 0 5.993-.142"/>
    <path d="M6 19a3 3 0 1 0 5.993-.142"/>
    <path d="M12 12a3 3 0 1 0 0-5.993A3 3 0 0 0 12 12Z"/>
    <path d="M12 12a3 3 0 1 0 0 5.993A3 3 0 0 0 12 12Z"/>
    <path d="M15 9h-3"/>
    <path d="M15 15h-3"/>
    <path d="M9 9h-3"/>
    <path d="M9 15h-3"/>
    <path d="M12 9V6"/>
    <path d="M12 15v3"/>
  </svg>
);
