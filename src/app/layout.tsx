import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';

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
  title: 'Owen Kim — Biomedical Engineer & AI Researcher',
  description:
    'BME student at University of Waterloo. Building diagnostic AI and medical imaging tools at Harvard Medical School, UWaterloo Critical ML Lab, and SickKids.',
  openGraph: {
    title: 'Owen Kim — Biomedical Engineer & AI Researcher',
    description:
      'BME student at University of Waterloo. Building diagnostic AI and medical imaging tools at Harvard Medical School, UWaterloo Critical ML Lab, and SickKids.',
    type: 'website',
    locale: 'en_CA',
    url: 'https://owenkim.dev',
    siteName: 'Owen Kim',
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
        <div style={{ background: '#BA7517', color: '#0a0a12', textAlign: 'center', padding: '8px', fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em', zIndex: 9999, position: 'sticky', top: 0 }}>
          🚧 WORK IN PROGRESS 🚧
        </div>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
