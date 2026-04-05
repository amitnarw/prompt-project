'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Lightbulb, Bot, User, LogOut, Bookmark, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: 'http://localhost:3000/',
    });
    if (error) {
      toast.error(error.message || 'Failed to login with Google');
    }
  };

  const handlePlaygroundClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to access the Playground');
      return;
    }
    router.push('/playground');
  };

  return (
    <header className="border-b border-[rgba(72,72,72,0.15)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-[#ffb5a0]" />
          <span className="font-bold text-xl text-[#e7e5e4]">Prompt Verse</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="text-[#e7e5e4]">Browse</Button>
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/bookmarks">
                <Button variant="ghost" className="gap-2 text-[#e7e5e4]">
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="ghost" className="gap-2 text-[#e7e5e4]">
                  <FolderOpen className="h-4 w-4" />
                  Collections
                </Button>
              </Link>
            </>
          )}
          <a href="/playground" onClick={handlePlaygroundClick}>
            <Button variant="ghost" className="gap-2 text-[#e7e5e4]">
              <Bot className="h-4 w-4" />
              Playground
            </Button>
          </a>
          {isAuthenticated ? (
            <>
              <Link href="/prompts/new">
                <Button>Create Prompt</Button>
              </Link>
              <div className="flex items-center gap-2 ml-2">
                <span className="flex items-center gap-1 text-sm text-[#acabaa]">
                  <User className="h-4 w-4" />
                  {user?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-1 text-[#e7e5e4]">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : isLoading ? (
            <span className="text-sm text-[#acabaa]">Loading...</span>
          ) : (
            <Button variant="outline" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}