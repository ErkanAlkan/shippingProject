import React from "react";
import styles from "./RightSidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCloud, faTornado } from "@fortawesome/free-solid-svg-icons";

interface RightSidebarProps {
  onToggleTopbar: () => void;
  onToggleTopbarForCarbon: () => void;
  onToggleAllCycloneLayers: () => void;
  showTopbar: boolean;
  showTopbarForCarbon: boolean;
  showCycloneLayers: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  onToggleTopbar,
  onToggleTopbarForCarbon,
  onToggleAllCycloneLayers,
  showTopbar,
  showTopbarForCarbon,
  showCycloneLayers,
}) => {
  return (
    <div className={styles.rightSidebar}>
      <button
        className={`${styles.iconButton} ${showTopbar ? styles.on : ""}`}
        onClick={onToggleTopbar}
        title="Toggle Route Bar"
      >
        <FontAwesomeIcon icon={faEye} size="2x" />
      </button>
      <button
        className={`${styles.iconButton} ${showTopbarForCarbon ? styles.on : ""}`}
        onClick={onToggleTopbarForCarbon}
        title="Toggle Calculation Bar"
      >
        <FontAwesomeIcon icon={faCloud} size="2x" />
      </button>
      <button
        className={`${styles.iconButton} ${showCycloneLayers ? styles.on : ""}`}
        onClick={onToggleAllCycloneLayers}
        title="Toggle Cyclone Layers"
      >
        <FontAwesomeIcon icon={faTornado} size="2x" />
      </button>
    </div>
  );
};

export default RightSidebar;
