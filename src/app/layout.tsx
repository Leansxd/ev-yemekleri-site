import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'EV BAR & KITCHEN',
  description: 'EV Bar & Kitchen. Modern atmosferimizde eşsiz lezzetleri deneyimleyin.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
