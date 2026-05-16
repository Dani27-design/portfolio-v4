'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeProvider';

interface CodeTextProps {
  children: string;
  tag?: string;
  className?: string;
  type?: 'html' | 'css' | 'js' | 'logic';
  label?: string;
}

export const CodeText: React.FC<CodeTextProps> = ({
  children,
  tag = 'span',
  className = '',
  type = 'html',
  label,
}) => {
  const { isCodeMode } = useTheme();

  if (!isCodeMode) {
    return <span className={className}>{children}</span>;
  }

  const renderCodeContent = () => {
    switch (type) {
      case 'html':
        return (
          <>
            <span className="text-pink-500 opacity-60">{'<'}{tag}{'>'}</span>
            <span className={className}>{children}</span>
            <span className="text-pink-500 opacity-60">{'</'}{tag}{'>'}</span>
          </>
        );
      case 'css':
        return (
          <>
            <span className="text-yellow-500 opacity-60">.text_content {'{'} </span>
            <span className={className}>{children}</span>
            <span className="text-yellow-500 opacity-60"> {'}'}</span>
          </>
        );
      case 'js':
        return (
          <>
            <span className="text-blue-500 opacity-60">const {label || 'content'} = &quot;</span>
            <span className={className}>{children}</span>
            <span className="text-blue-500 opacity-60">&quot;;</span>
          </>
        );
      case 'logic':
        return (
          <>
            <span className="text-purple-500 opacity-60">if (is_visible) {'{'} </span>
            <span className={className}>{children}</span>
            <span className="text-purple-500 opacity-60"> {'}'}</span>
          </>
        );
      default:
        return <span>{children}</span>;
    }
  };

  return <span className="font-mono transition-all duration-300 inline-block">{renderCodeContent()}</span>;
};
