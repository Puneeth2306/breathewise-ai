import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'BreatheWise AI — Know Your Air. Protect Your Family. Improve Your Environment.',
  description: 'GenAI-powered environmental assistant for urban air pollution, smog mitigation, personalized daily routines, indoor air quality, sustainable living, and emissions tracking.',
  keywords: ['Air Quality', 'AQI', 'Bengaluru Air Quality', 'PM2.5', 'Smog Protection', 'Air Purifier Advisor', 'HEPA', 'Sustainable Commute', 'Environmental AI', 'Gemini AI'],
  authors: [{ name: 'BreatheWise AI' }],
  openGraph: {
    title: 'BreatheWise AI — Environmental & Smog Protection Assistant',
    description: 'Transform complicated pollution data into simple, actionable daily family protection decisions.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
