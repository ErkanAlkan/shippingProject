"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Topbar from "./components/Topbar/Topbar";
import TopbarForCarbon from "./components/TopbarForCarbon/TopbarForCarbon";
import RightSidebar from "./components/RightSidebar/RightSidebar";
import styles from "./ClientRootLayout.module.css";

const Map = dynamic(() => import("~/app/components/Map/Map"), { ssr: false });

const HomePage = () => {
  const [showTopbar, setShowTopbar] = useState(true);
  const [showTopbarForCarbon, setShowTopbarForCarbon] = useState(true);

  const toggleTopbar = () => setShowTopbar((prev) => !prev);
  const toggleTopbarForCarbon = () => setShowTopbarForCarbon((prev) => !prev);

  return (
    <div className="relative min-h-screen">
      <Map />
      <div className={showTopbarForCarbon ? styles.visible : styles.hidden}>
        <TopbarForCarbon />
      </div>
      <div className={showTopbar ? styles.visible : styles.hidden}>
        <Topbar />
      </div>
      <RightSidebar onToggleTopbar={toggleTopbar} onToggleTopbarForCarbon={toggleTopbarForCarbon} />
    </div>
  );
};

export default HomePage;
