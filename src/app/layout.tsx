import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/styles/globals.css';
import styles from './layout.module.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

import Sidebar from '~/app/components/Sidebar/Sidebar';
import Topbar from '~/app/components/Topbar/Topbar';
import TopbarForCarbon from '~/app/components/TopbarForCarbon/TopbarForCarbon';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${styles.root}`}>
        <div className={styles.topbarContainer}>
          <Topbar />
          <TopbarForCarbon />
        </div>
        <Sidebar />
        <div className={styles.content}>{children}</div>
      </body>
    </html>
  );
}
