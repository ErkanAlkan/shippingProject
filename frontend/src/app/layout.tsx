//layout.tsx main

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';
import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shipping Project',
  description: 'Shipping Project for intercontinental shipping purposes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} ${styles.root}`}>
        {children}
      </body>
    </html>
  );
}
