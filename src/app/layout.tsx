import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';
import NeuronCanvas from '@/components/layout/NeuronCanvas';

const inter = Inter({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Owen Kim',
    template: '%s | Owen Kim',
  },
  description: 'Biomedical Engineering student at the University of Waterloo, building wearable systems, medical devices, and machine learning models that translate research into systems that improve quality of life.',
  metadataBase: new URL('https://www.owenkim.ca'),
  openGraph: {
    title: 'Owen Kim',
    description: 'Biomedical Engineering student at the University of Waterloo, building wearable systems, medical devices, and machine learning models.',
    url: 'https://www.owenkim.ca',
    siteName: 'Owen Kim',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Owen Kim',
    description: 'Biomedical Engineering student at the University of Waterloo, building wearable systems, medical devices, and machine learning models.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <div style={{ position: 'relative' }}>
          <NeuronCanvas />
          {children}
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
