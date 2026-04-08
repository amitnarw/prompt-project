'use client';

import React from 'react';

export const Footer: React.FC = () => (
  <footer className="w-full py-16 px-8 flex justify-between items-end relative overflow-hidden text-on-surface">
    <div className="absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-accent-orange via-accent-orange/50 to-transparent pointer-events-none -z-10"></div>
    <div className="flex flex-col gap-4">
      <span className="text-white font-black font-headline text-2xl tracking-tighter">PROMPT HUB</span>
      <span className="font-label text-[10px] uppercase tracking-widest font-bold">© 2024 PROMPT HUB. ENGINEERED FOR PRECISION.</span>
    </div>
    <div className="flex gap-8 items-center">
      <a className="font-label text-[10px] uppercase tracking-widest font-bold text-white underline decoration-white/30 hover:decoration-white transition-colors cursor-pointer" href="#">Terms</a>
      <a className="font-label text-[10px] uppercase tracking-widest font-bold text-white underline decoration-white/30 hover:decoration-white transition-colors cursor-pointer" href="#">Privacy</a>
      <a className="font-label text-[10px] uppercase tracking-widest font-bold text-white underline decoration-white/30 hover:decoration-white transition-colors cursor-pointer" href="#">API</a>
    </div>
  </footer>
);