'use client';
import React from 'react';
import { Inter } from "next/font/google";
import Image from 'next/image';
import "./globals.css";
import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import SubscribeButton from '@/components/ui/SubscribeButton';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body className="min-h-screen flex flex-col bg-gray-100">
          <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <Image
                src="/sanbene-logo.png"
                alt="San Benedetto Logo"
                width={150}
                height={75}
                priority
              />
              <div className="flex items-center space-x-4">
                <SignedIn>
                  <SubscribeButton />
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            <SignedIn>
              {children}
            </SignedIn>
            <SignedOut>
              <div className="flex items-center justify-center h-full">
                <div className="bg-white border border-blue-800 p-8 rounded-lg shadow-md max-w-md w-full">
                  <SignIn />
                </div>
              </div>
            </SignedOut>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}