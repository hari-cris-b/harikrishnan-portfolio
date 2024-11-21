import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import ClientLayout from '@/components/ClientLayout';
import Loading from './loading';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AnimationProvider } from '@/contexts/AnimationContext';
import ChatBot from '@/components/chat/ChatBot';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-[#0f0e0e]`}>
        <ThemeProvider>
          <AnimationProvider>
            <Suspense fallback={<Loading />}>
              <ClientLayout>
                {children}
              </ClientLayout>
            </Suspense>
            <ChatBot />
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}