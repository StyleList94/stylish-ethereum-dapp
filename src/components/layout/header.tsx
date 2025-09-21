'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import HeaderContent from './header-content';

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        setIsVisible(currentScrollY > 0);
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full h-14 z-50',
        'border-b border-b-gray-200/80 dark:border-b-gray-700/80',
        'bg-white dark:bg-neutral-900',
        'transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : '-translate-y-14',
      )}
    >
      <HeaderContent />
    </header>
  );
}
