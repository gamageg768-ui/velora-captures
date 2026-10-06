import type { Metadata, Viewport } from 'next';
import { Fraunces, Hanken_Grotesk, JetBrains_Mono, Josefin_Sans } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const logo = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '600'],
  variable: '--font-logo',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://veloracaptures.com'),
  title: {
    default: 'Velora Captures — Photography Studio',
    template: '%s — Velora Captures',
  },
  description:
    'An independent photography studio for portraits, editorial, and commercial work. Every frame is composed deliberately and made to last.',
  manifest: '/manifest.json',
  applicationName: 'Velora Captures',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Velora Captures',
  },
  openGraph: {
    title: 'Velora Captures — Photography Studio',
    description: 'Portraits, editorial, and commercial photography. Every frame made to last.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${logo.variable}`}>
      <body className="bg-bg text-ink antialiased min-h-screen">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Velora Captures",
          "description": "An independent photography studio for portraits, editorial, and commercial work.",
          "url": "https://veloracaptures.com",
          "email": "contact.veloralabs@gmail.com",
          "sameAs": ["https://instagram.com/veloracaptures"]
        }} />
        <SmoothScroll>
          <Nav />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
        <div className="vignette" aria-hidden />
      </body>
    </html>
  );
}
