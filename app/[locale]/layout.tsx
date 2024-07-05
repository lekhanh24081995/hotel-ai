import { Inter } from 'next/font/google';
import './globals.css';
import { dir } from 'i18next';
import { Metadata } from 'next';
import { i18nConfig } from '../../i18nConfig';
import { ToastContainer } from 'react-toastify';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { TooltipProvider } from '../components/ui/tooltip';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Hotel AI',
    default: 'Hotel AI'
  },
  description:
    'Discover your perfect travel itinerary with our AI-powered chatbot. Whether you"re planning a weekend getaway or a long vacation, our chatbot assists you in selecting destinations, booking flights, finding accommodations, and exploring local attractions. Get personalized travel recommendations and make your journey memorable with our smart and easy-to-use travel planning tool.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => {
    locale;
  });
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={dir(locale)}>
      <SessionProvider>
        <ReactQueryProvider>
          <TooltipProvider>
            <body className={inter.className}>
              {children}
              <ToastContainer
                hideProgressBar={true}
                icon={false}
                toastClassName={'bg-red-500'}
                theme="dark"
                autoClose={2000}
              />
            </body>
          </TooltipProvider>
        </ReactQueryProvider>
      </SessionProvider>
    </html>
  );
}
