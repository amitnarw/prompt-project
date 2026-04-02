import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lightbulb, Bot } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Prompt Verse - AI Prompt Library',
  description: 'Share, test, and discover AI prompts',
};

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
            <header className="border-b">
              <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl">Prompt Verse</span>
                </Link>
                <nav className="flex items-center gap-4">
                  <Link href="/">
                    <Button variant="ghost">Browse</Button>
                  </Link>
                  <Link href="/playground">
                    <Button variant="ghost" className="gap-2">
                      <Bot className="h-4 w-4" />
                      Playground
                    </Button>
                  </Link>
                  <Link href="/prompts/new">
                    <Button>Create Prompt</Button>
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
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
