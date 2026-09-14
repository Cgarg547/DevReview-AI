import React from 'react';

export const JsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#F7DF1E" />
    <text x="12" y="17" fontFamily="Arial, sans-serif" fontSize="12" fill="black" textAnchor="middle" fontWeight="bold">JS</text>
  </svg>
);
