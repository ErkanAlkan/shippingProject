"use client";
import React from "react";
import styles from "./layout.module.css";
import AuthGuard from "~/app/components/AuthGuard/AuthGuard";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className={styles.mainContent}>
        <div className={styles.content}>{children}</div>
      </div>
    </AuthGuard>
  );
}
