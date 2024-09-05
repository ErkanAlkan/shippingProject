"use client";

import React, { useState } from 'react';
import styles from './ClientRootLayout.module.css';

import Sidebar from '~/app/components/Sidebar/Sidebar';
import Topbar from '~/app/components/Topbar/Topbar';
import TopbarForCarbon from '~/app/components/TopbarForCarbon/TopbarForCarbon';
import RightSidebar from '~/app/components/RightSidebar/RightSidebar';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const [showTopbar, setShowTopbar] = useState(true);
  const [showTopbarForCarbon, setShowTopbarForCarbon] = useState(true);

  const toggleTopbar = () => setShowTopbar((prev) => !prev);
  const toggleTopbarForCarbon = () => setShowTopbarForCarbon((prev) => !prev);

  return (
    <div className={styles.clientRoot}>
      <Sidebar /> 
      <div className={styles.mainContent}>
        <div className={styles.topbarContainer}>
          <div className={showTopbar ? styles.visible : styles.hidden}>
            <Topbar />
          </div>
          <div className={showTopbarForCarbon ? styles.visible : styles.hidden}>
            <TopbarForCarbon />
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <RightSidebar
        onToggleTopbar={toggleTopbar}
        onToggleTopbarForCarbon={toggleTopbarForCarbon}
      />
    </div>
  );
}
