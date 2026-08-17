import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flip Culture | Curated Tech, Gaming, Streetwear & Everyday Deals',
  description:
    'Discover real-time verified active marketplace drops for deadstock sneakers, high-spec gaming laptops, retro tech, and rare streetwear grails.',
  keywords: [
    'Flip Culture',
    'Air Jordans',
    'Sneaker Resale',
    'Gaming Laptops',
    'Streetwear Grails',
    'Yeezy Drops',
    'ROG Zephyrus',
    'Steam Deck OLED',
  ],
  authors: [{ name: 'Flip Culture' }],
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Flip Culture | Curated Tech, Gaming & Streetwear',
    description:
      'Curated active drops for Jordans, Yeezys, ROG Gaming Laptops, and handheld gaming rigs.',
    url: 'https://flipculture.app',
    siteName: 'Flip Culture',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'Flip Culture Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-neutral-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
