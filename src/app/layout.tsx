import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Header, Footer } from '@/components/layout';
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
  title: 'The Best Nexus Letters - Professional Nexus Letter Service',
  description: 'Professional medical nexus letters for VA disability claims. Licensed healthcare professionals provide comprehensive documentation to support your case.',
  keywords: 'nexus letter, VA disability, veterans, medical documentation, disability claims',
  openGraph: {
    title: 'The Best Nexus Letters - Professional Medical Documentation',
    description: 'Get professional nexus letters from licensed healthcare providers to support your VA disability claims.',
    type: 'website',
    siteName: 'The Best Nexus Letters',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Best Nexus Letters',
    description: 'Professional medical nexus letters for VA disability claims',
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
        <ThemeProvider>
          <a 
            href="#main-content" 
            className="skip-link"
            tabIndex={0}
          >
            Skip to main content
          </a>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
