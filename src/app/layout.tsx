import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Seika SOP",
  description: "Standard Operating Procedures management by Seika Innovation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <Image
                src="/seika-logo.png"
                alt="Seika Innovation Logo"
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
          <main className="flex-grow flex items-center justify-center">
            <SignedIn>
              <div className="w-full h-full">
                {children}
              </div>
            </SignedIn>
            <SignedOut>
              <div className="bg-white border border-[#536f4d] p-8 rounded-lg shadow-md max-w-md w-full">
                <SignIn />
              </div>
            </SignedOut>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
