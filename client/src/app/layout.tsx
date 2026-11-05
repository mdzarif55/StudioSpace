import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform',
  description: 'High-performance peer-to-peer marketplace designed for creators, filmmakers, photographers, podcasters, and musicians to discover, inspect, and book verified studio spaces.',
  keywords: [
    'studio sharing',
    'photo studio rental',
    'sound stage',
    'podcast lounge',
    'music studio',
    'creative workspaces',
    'filmmaking locations'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen flex flex-col justify-between font-sans">
        <ThemeProvider>
          <AuthProvider>
            <Toaster richColors position="top-right" closeButton />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

