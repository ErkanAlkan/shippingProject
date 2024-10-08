"use client";
import React from "react";
import { usePathname } from "next/navigation";
import styles from "./ClientRootLayout.module.css";
import Sidebar from "~/app/components/LeftSidebar/LeftSidebar";
import { RouteProvider } from "~/app/context/RouteContext";
import { LayerProvider } from "~/app/context/LayerContext";
import { TopbarProvider } from "~/app/context/TopbarContext";
import { PortProvider } from "~/app/context/PortContext";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showSidebar = pathname !== "/auth/signin";

  return (
    <RouteProvider>
      <LayerProvider>
        <TopbarProvider>
          <PortProvider>
            <div className={styles.clientRoot}>
              {showSidebar && <Sidebar />}
              <div className={styles.mainContent}>
                <div className={styles.content}>{children}</div>
              </div>
            </div>
          </PortProvider>
        </TopbarProvider>
      </LayerProvider>
    </RouteProvider>
  );
}
