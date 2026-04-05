'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Lightbulb, Bot, User, LogOut, Bookmark, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleGoogleLogin = async () => {
    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: 'http://localhost:3000/',
    });
    if (error) {
      toast.error(error.message || 'Failed to login with Google');
    }
  };

  return (
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
          {isAuthenticated && (
            <>
              <Link href="/bookmarks">
                <Button variant="ghost" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </Button>
              </Link>
              <Link href="/collections">
                <Button variant="ghost" className="gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Collections
                </Button>
              </Link>
            </>
          )}
          <Link href="/playground">
            <Button variant="ghost" className="gap-2">
              <Bot className="h-4 w-4" />
              Playground
            </Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/prompts/new">
                <Button>Create Prompt</Button>
              </Link>
              <div className="flex items-center gap-2 ml-2">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {user?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="gap-1">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : isLoading ? (
            <span className="text-sm text-muted-foreground">Loading...</span>
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