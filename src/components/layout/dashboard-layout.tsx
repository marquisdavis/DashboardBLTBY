'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navLinks = [
  { label: 'Dashboard', href: '/' },
  { label: 'Tokens', href: '/tokens' },
  { label: 'NFTs', href: '/nfts' },
  { label: 'Governance', href: '/governance' },
  { label: 'Buy BLTBY Token', href: '/buy-bltby' },
];

export default function DashboardLayout({
  children,
  title = 'Dashboard',
}: {
  children: ReactNode;
  title?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f2f3f5] font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r shadow-md flex-col p-6">
        <Link href="/" className="mb-8">
          <Image
            src="/builtbydao-logo.svg"
            alt="Built By DAO"
            width={180}
            height={40}
            priority
          />
        </Link>
        <nav className="space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname === link.href ? 'bg-indigo-600 text-white' : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">☰</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="text-xl font-bold mb-6">Built By DAO</SheetTitle>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-2 rounded text-sm font-medium transition ${
                    pathname === link.href ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Top Header */}
        <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm gap-4">
          <h1 className="text-xl font-semibold text-gray-900 whitespace-nowrap">{title}</h1>

          <div className="flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
