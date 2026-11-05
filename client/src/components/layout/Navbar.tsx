'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Aperture,
  Sun,
  Moon,
  User as UserIcon,
  PlusCircle,
  FolderKanban,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore Studios', href: '/studios' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#0c0e14]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Aperture / Spotlight Icon */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
            <Aperture className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1">
              Studio<span className="text-orange-500">Space</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase -mt-1">
              Production Sharing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Active Indicators */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-400 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle & User Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggler (Challenge 3) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Unauthenticated State */}
          {!user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-orange-500 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 rounded-xl shadow-md shadow-orange-600/20 hover:shadow-orange-600/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Register
              </Link>
            </div>
          ) : (
            /* Authenticated State */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 dark:hover:border-orange-500/50 bg-zinc-50 dark:bg-zinc-900 transition-all"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/40"
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#151922] border border-zinc-200 dark:border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Verified Creator Pass</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                      Dashboard
                    </Link>

                    <Link
                      href="/add-studio"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-zinc-400" />
                      Add New Studio
                    </Link>

                    <Link
                      href="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 transition-colors"
                    >
                      <FolderKanban className="w-4 h-4 text-zinc-400" />
                      My Studio Listings
                    </Link>

                    <Link
                      href="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4 text-zinc-400" />
                      My Bookings
                    </Link>
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0e14] px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'text-orange-500 font-bold bg-orange-50 dark:bg-zinc-900'
                    : 'text-zinc-700 dark:text-zinc-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    <LayoutDashboard className="w-4 h-4 text-orange-500" />
                    Dashboard
                  </Link>
                  <Link
                    href="/add-studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    <PlusCircle className="w-4 h-4 text-orange-500" />
                    Add Studio
                  </Link>
                  <Link
                    href="/my-listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    <FolderKanban className="w-4 h-4 text-orange-500" />
                    My Listings
                  </Link>
                  <Link
                    href="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-sm font-medium text-zinc-800 dark:text-zinc-200"
                  >
                    <CalendarCheck className="w-4 h-4 text-orange-500" />
                    My Bookings
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-3 py-2.5 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold text-zinc-900 dark:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

