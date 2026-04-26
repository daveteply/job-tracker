'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { AuthMenu } from './auth-menu';

export interface HeaderProps {
  title: string;
  iconSrc?: string;
  homeHref?: string;
}

export function Header({ title, iconSrc, homeHref = '/home' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-blue-600 p-4 text-white transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-none'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2">
          {iconSrc && <img src={iconSrc} alt="App Icon" className="h-8 w-8 rounded" />}
          <h1 className="text-2xl font-bold">{title}</h1>
        </Link>
        <AuthMenu />
      </div>
    </header>
  );
}

export default Header;
