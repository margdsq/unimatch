import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'CREW — Find your people',
  description: 'Discover collaborators, join opportunities, and build better student teams with AI-powered matching.',
  openGraph: {
    title: 'CREW — Find your people',
    description: 'Discover people, ideas, and balanced project teams with AI-powered matching.',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'CREW — Find your people. Make something happen.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CREW — Find your people',
    description: 'Discover people, ideas, and balanced project teams with AI-powered matching.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
