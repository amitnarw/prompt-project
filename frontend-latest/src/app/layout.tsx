import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Loader2 } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prompt Verse - AI Prompt Library',
  description: 'Share, test, and discover AI prompts',
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="py-6 bg-gradient-to-t from-[#ff4500] via-[rgba(255,69,0,0.4)] to-transparent">
              <div className="container mx-auto px-4 text-center text-sm text-[#e7e5e4]">
                Prompt Verse - A place to share and test AI prompts
              </div>
            </footer>
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
