"use client";
import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import styles from "./ClientRootLayout.module.css";
import { RouteProvider } from "~/app/context/RouteContext";
import { LayerProvider } from "~/app/context/LayerContext";
import { TopbarProvider } from "~/app/context/TopbarContext";
import { PortProvider } from "~/app/context/PortContext";

const Sidebar = dynamic(() => import("~/app/components/LeftSidebar/LeftSidebar"), { ssr: false });

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showSidebar = pathname && pathname !== "/auth/signin";

  if (typeof pathname === "undefined") {
    return null;
  }

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
