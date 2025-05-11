import React from 'react';
import { ThemeToggle } from './ui/theme-toggle';
import Link from 'next/link';
import { ConnectWallet } from './ui/connect-wallet';

interface LayoutProps {
  children: React.ReactNode;
}

import { ApiKeysDialog } from './ui/api-keys-dialog';

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Build Sig</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-foreground/80">
                Home
              </Link>
              <Link href="/create-account" className="transition-colors hover:text-foreground/80">
                Create Account
              </Link>
              <Link href="/" className="transition-colors hover:text-foreground/80">
                Home
              </Link>
              <Link href="/list-accounts" className="transition-colors hover:text-foreground/80">
                List Accounts
              </Link>
              <Link href="/create-account" className="transition-colors hover:text-foreground/80">
                Create Account
              </Link>
              <Link href="/list-smart-accounts" className="transition-colors hover:text-foreground/80">
                List Smart Accounts
              </Link>
              <Link href="/create-smart-account" className="transition-colors hover:text-foreground/80">
                Create Smart Account
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ConnectWallet />
            <ApiKeysDialog />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}