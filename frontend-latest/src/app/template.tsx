'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    // Small delay to allow exit animation before new page enters
    const timer = setTimeout(() => {
      setKey(pathname);
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div key={key} className="page-transition-wrapper">
      {children}
    </div>
  );
}