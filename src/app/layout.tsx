import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '~/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

import Sidebar from '~/app/components/Sidebar/Sidebar';
import Topbar from '~/app/components/Topbar/Topbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen`}>
        <Topbar />
        <Sidebar />
        <div className="relative min-h-screen z-0">{children}</div>
      </body>
    </html>
  );
}
