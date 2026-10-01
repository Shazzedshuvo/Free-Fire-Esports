import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import '@/styles/globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import LiveChatWidget from '@/components/LiveChatWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const rajdhani = Rajdhani({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
});

export const metadata: Metadata = {
  title: 'FREE FIRE ESPORTS BD - Play Tournaments, Win Real Cash',
  description: 'Bangladesh premier Free Fire esports tournament platform. Daily custom matches for Solo, Duo, Squad. Fast bKash deposits and instant verified prize payouts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable} light`}>
      <body className="bg-slate-50 text-slate-900 dark:bg-charcoal-950 dark:text-gray-100 min-h-screen flex flex-col font-sans selection:bg-ff-orange selection:text-white pb-16 md:pb-0 transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 text-base">
                {children}
              </main>
              <Footer />
              <BottomNav />
              <LiveChatWidget />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
