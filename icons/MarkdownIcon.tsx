import React from 'react';

export const MarkdownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="3" fill="#384047" />
    <text x="12" y="17" fontFamily="Arial, sans-serif" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">MD</text>
  </svg>
);
