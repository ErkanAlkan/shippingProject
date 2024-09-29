"use client";
import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import Topbar from "./components/Topbar/Topbar";
import TopbarForCarbon from "./components/TopbarForCarbon/TopbarForCarbon";
import RightSidebar from "./components/RightSidebar/RightSidebar";
import styles from "./ClientRootLayout.module.css";
import { useRouteContext } from "~/app/context/RouteContext";
import { useLayerContext } from "~/app/context/LayerContext";

const Map = dynamic(() => import("~/app/components/Map/Map"), { ssr: false });

interface User {
  email: string;
}

const HomePage = () => {
  const router = useRouter();
  const [showTopbar, setShowTopbar] = useState(true);
  const [showTopbarForCarbon, setShowTopbarForCarbon] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { globalRouteData } = useRouteContext();
  console.log("HomePage ~ globalRouteData:", globalRouteData);

  const { showCycloneLayers, setShowCycloneLayers } = useLayerContext();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auth/session", {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        router.push("/auth/signin");
      }
    };

    checkUser();
  }, [router]);

  const toggleTopbar = () => setShowTopbar((prev) => !prev);
  const toggleTopbarForCarbon = () => setShowTopbarForCarbon((prev) => !prev);

  const toggleAllCycloneLayers = () => {
    setShowCycloneLayers((prev: boolean) => !prev);
  };
  const totalDistance = useMemo(() => {
    return globalRouteData && globalRouteData.length > 0
      ? parseFloat(globalRouteData[globalRouteData.length - 1].cumulative_dist)
      : null;
  }, [globalRouteData]);

  if (user) {
    return (
      <div className="relative min-h-screen">
        <Map
          showForecastConeLayer={showCycloneLayers}
          showObservedTrackLayer={showCycloneLayers}
          showForecastTrackLayer={showCycloneLayers}
        />
        {showTopbarForCarbon && totalDistance && (
          <div className={styles.visible}>
            <TopbarForCarbon totalDistance={totalDistance} globalRouteData={globalRouteData} />
          </div>
        )}
        <div className={showTopbar ? styles.visible : styles.hidden}>
          <Topbar />
        </div>
        <RightSidebar
          onToggleTopbar={toggleTopbar}
          onToggleTopbarForCarbon={toggleTopbarForCarbon}
          onToggleAllCycloneLayers={toggleAllCycloneLayers}
        />
      </div>
    );
  }

  return null;
};

export default HomePage;
