'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, LogOut, LogIn, Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, Menu, Sun, Moon } from 'lucide-react';
import { getSession, signInWithEmail, signUpWithEmail, signOut, signInWithGoogle, User } from '@/lib/auth';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// ============================================================
// Login / Signup Modal
// ============================================================

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = mode === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, name);
      onSuccess(result.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign in failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-surface-container z-10 ghost-border shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 glow-overlay pointer-events-none" />

        {/* Header */}
        <div className="p-8 pb-6 z-10 relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline font-extrabold text-2xl uppercase tracking-tight">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                {mode === 'signin' ? 'Access the playground and manage prompts' : 'Join the Prompt Hub community'}
              </p>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors mt-1 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 h-12 border border-outline-variant/30 font-label text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-colors disabled:opacity-50 mb-6 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-[1px] bg-outline-variant/20" />
            <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">or</span>
            <div className="flex-1 h-[1px] bg-outline-variant/20" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1.5">Name</label>
                <div className="relative flex items-center">
                  <UserIcon size={14} className="absolute left-3 text-on-surface-variant" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-tertiary/50 text-on-surface pl-9 pr-4 py-3 font-mono text-sm outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1.5">Email</label>
              <div className="relative flex items-center">
                <Mail size={14} className="absolute left-3 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-tertiary/50 text-on-surface pl-9 pr-4 py-3 font-mono text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Lock size={14} className="absolute left-3 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-tertiary/50 text-on-surface pl-9 pr-10 py-3 font-mono text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-label text-[10px] uppercase tracking-widest text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-on-surface text-background font-label text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); }}
              className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
// Mobile Menu Overlay
// ============================================================

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { label: string; href: string }[];
  user: User | null;
  onSignInClick: () => void;
  onSignOut: () => void;
  onSettingsClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navItems, user, onSignInClick, onSignOut, onSettingsClick, darkMode, onToggleDarkMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] md:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full bg-surface-container border-b border-outline-variant/10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>

            {/* Nav Items */}
            <div className="pt-24 pb-8 px-8">
              <nav className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-4 px-4 font-headline text-2xl font-bold uppercase tracking-tight text-on-surface hover:text-primary transition-colors border-b border-outline-variant/5"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Settings & Theme */}
              <div className="mt-8 pt-8 border-t border-outline-variant/10 flex flex-col gap-2">
                <button
                  onClick={() => { onSettingsClick(); onClose(); }}
                  className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  <Settings size={18} />
                  <span className="font-label text-xs uppercase tracking-widest">Settings</span>
                </button>
                <button
                  onClick={() => { onToggleDarkMode(); onClose(); }}
                  className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  <span className="font-label text-xs uppercase tracking-widest">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              {/* Auth actions */}
              <div className="mt-8 pt-8 border-t border-outline-variant/10">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-4">
                      {user.image ? (
                        <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-tertiary/20 text-tertiary font-bold">
                          {(user.name || user.email)[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-label text-sm text-on-surface">{user.name || 'User'}</p>
                        <p className="font-label text-xs text-on-surface-variant">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { onSignOut(); onClose(); }}
                      className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <LogOut size={18} />
                      <span className="font-label text-xs uppercase tracking-widest">Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onSignInClick(); onClose(); }}
                    className="flex items-center gap-2 w-full px-4 py-3 bg-on-surface text-background font-label text-sm uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
                  >
                    <LogIn size={18} />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================
// Navbar
// ============================================================

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const menuRef = useRef<HTMLDivElement>(null);

  // Apply dark class and load session on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    getSession().then(data => {
      if (data?.user) setUser(data.user);
    });
  }, []);

  // Track scroll for navbar style change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setShowUserMenu(false);
    } catch {
      // ignore
    }
  };

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Nav items based on auth state
  const navItems = user
    ? [
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: 'About', href: '/about' },
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ];

  return (
    <>
      <nav className={`sticky top-0 z-50 flex justify-between items-center px-6 md:px-8 h-16 transition-all duration-200 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25)]' : 'bg-transparent'}`}>
        <div className="flex items-center gap-8 md:gap-12">
          <span
            className="text-lg md:text-xl font-black tracking-tighter text-on-surface font-headline cursor-pointer"
            onClick={() => router.push('/')}
          >
            PROMPT HUB
          </span>
          <div className="hidden md:flex gap-6 lg:gap-8 items-center h-full">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-headline uppercase tracking-wider text-sm font-bold transition-colors ${
                  activeTab === item.label.toLowerCase()
                    ? 'text-on-surface border-b-2 border-primary/40 pb-1'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={handleToggleDarkMode}
            className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer p-1"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button onClick={() => router.push('/settings')} className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer p-1">
            <Settings size={20} />
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="w-8 h-8 bg-surface-container-highest overflow-hidden border border-outline-variant/20 hover:border-tertiary/40 transition-colors cursor-pointer"
                >
                  {user.image ? (
                    <img alt="User Profile" className="w-full h-full object-cover" src={user.image} referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-tertiary/20 text-tertiary font-bold text-sm">
                      {(user.name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 top-10 w-56 bg-surface-container border border-outline-variant/20 shadow-2xl z-50"
                    >
                      <div className="p-4 border-b border-outline-variant/10">
                        <p className="font-label text-[10px] uppercase tracking-widest text-on-surface truncate">
                          {user.name || 'User'}
                        </p>
                        <p className="font-label text-[9px] text-on-surface-variant truncate mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span className="font-label text-[10px] uppercase tracking-widest">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 border border-outline-variant/30 font-label text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface hover:border-outline-variant/60 transition-all cursor-pointer"
              >
                <LogIn size={14} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer p-1"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        navItems={navItems}
        user={user}
        onSignInClick={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        onSettingsClick={() => router.push('/settings')}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={(newUser) => setUser(newUser)}
          />
        )}
      </AnimatePresence>
    </>
  );
};