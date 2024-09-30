"use client";
import React from "react";
import { usePathname } from "next/navigation";
import styles from "./ClientRootLayout.module.css";
import Sidebar from "~/app/components/LeftSidebar/LeftSidebar";
import { RouteProvider } from "~/app/context/RouteContext";
import { LayerProvider } from "~/app/context/LayerContext";
import { TopbarProvider } from "~/app/context/TopbarContext";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showSidebar = pathname !== "/auth/signin";

  return (
    <RouteProvider>
      <LayerProvider>
        <TopbarProvider>
          <div className={styles.clientRoot}>
            {showSidebar && <Sidebar />}
            <div className={styles.mainContent}>
              <div className={styles.content}>{children}</div>
            </div>
          </div>
        </TopbarProvider>
      </LayerProvider>
    </RouteProvider>
  );
}
