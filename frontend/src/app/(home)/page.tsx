"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Topbar from "~/app/components/Topbar/Topbar";
import TopbarForCarbon from "~/app/components/TopbarForCarbon/TopbarForCarbon";
import RightSidebar from "~/app/components/RightSidebar/RightSidebar";
import styles from "./layout.module.css";
import { useRouteContext } from "~/app/context/RouteContext";
import { useLayerContext } from "~/app/context/LayerContext";
import { useTopbarContext } from "~/app/context/TopbarContext";
import Sidebar from "~/app/components/LeftSidebar/LeftSidebar";

const Map = dynamic(() => import("~/app/components/Map/Map"), { ssr: false });

const HomePage = () => {
  const { globalRouteData } = useRouteContext();
  const { showCycloneLayers, setShowCycloneLayers } = useLayerContext();
  const { showTopbar, showTopbarForCarbon, toggleTopbar, toggleTopbarForCarbon } = useTopbarContext();
  console.log("HomePage ~ showTopbarForCarbon:", showTopbarForCarbon);

  const toggleAllCycloneLayers = () => {
    setShowCycloneLayers((prev: boolean) => !prev);
  };

  const totalDistance = useMemo(() => {
    return globalRouteData && globalRouteData.length > 0
      ? parseFloat(globalRouteData[globalRouteData.length - 1].cumulative_dist)
      : null;
  }, [globalRouteData]);

  return (
    <div className="relative min-h-screen">
      <Map
        showForecastConeLayer={showCycloneLayers}
        showObservedTrackLayer={showCycloneLayers}
        showForecastTrackLayer={showCycloneLayers}
      />
      <div className={styles.flexContainer}>
        {showTopbar && (
          <div className={styles.topbarContainer}>
            <Topbar />
          </div>
        )}

        <div className={`${styles.topbarForCarbonContainer} ${!showTopbarForCarbon ? styles.hidden : ""}`}>
          {totalDistance && <TopbarForCarbon totalDistance={totalDistance} globalRouteData={globalRouteData} />}
        </div>
      </div>
      <Sidebar />
      <RightSidebar
        onToggleTopbar={toggleTopbar}
        onToggleTopbarForCarbon={toggleTopbarForCarbon}
        onToggleAllCycloneLayers={toggleAllCycloneLayers}
        showTopbar={showTopbar}
        showTopbarForCarbon={showTopbarForCarbon}
        showCycloneLayers={showCycloneLayers}
      />
    </div>
  );
};

export default HomePage;
