import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/styles/globals.css';
import styles from './layout.module.css';

import ClientRootLayout from './ClientRootLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shipping Project',
  description: 'Shipping Project for intercontinental shipping purposes',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${inter.className} ${styles.root}`}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
