import React, { useState } from 'react';
import { ThemeToggle } from './ui/theme-toggle';
import Link from 'next/link';
import { ConnectWallet } from './ui/connect-wallet';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

import { ApiKeysDialog } from './ui/api-keys-dialog';

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Build Sig</span>
            </Link>
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
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
              <Link href="/policy-management" className="transition-colors hover:text-foreground/80">
                Policy Management
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ConnectWallet />
            <ApiKeysDialog />
            <ThemeToggle />
          </div>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 py-2">
            <div className="container space-y-2 text-sm font-medium">
              <Link 
                href="/list-accounts" 
                className="block py-2 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                List Accounts
              </Link>
              <Link 
                href="/create-account" 
                className="block py-2 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </Link>
              <Link 
                href="/list-smart-accounts" 
                className="block py-2 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                List Smart Accounts
              </Link>
              <Link 
                href="/create-smart-account" 
                className="block py-2 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Smart Account
              </Link>
              <Link 
                href="/policy-management" 
                className="block py-2 transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Policy Management
              </Link>
            </div>
          </div>
        )}
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}