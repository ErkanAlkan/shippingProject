"use client";
import React from "react";
import styles from "./layout.module.css";
import { RouteProvider } from "~/app/context/RouteContext";
import { LayerProvider } from "~/app/context/LayerContext";
import { TopbarProvider } from "~/app/context/TopbarContext";
import { PortProvider } from "~/app/context/PortContext";
import AuthGuard from "~/app/components/AuthGuard/AuthGuard";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RouteProvider>
        <LayerProvider>
          <TopbarProvider>
            <PortProvider>
              <div className={styles.mainContent}>
                <div className={styles.content}>{children}</div>
              </div>
            </PortProvider>
          </TopbarProvider>
        </LayerProvider>
      </RouteProvider>
    </AuthGuard>
  );
}
