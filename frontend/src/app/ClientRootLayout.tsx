"use client";

import React from "react";
import styles from "./ClientRootLayout.module.css";

import Sidebar from "~/app/components/Sidebar/Sidebar";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.clientRoot}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
