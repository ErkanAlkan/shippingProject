import React from 'react';
import styles from './RightSidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCloud } from '@fortawesome/free-solid-svg-icons';

interface RightSidebarProps {
  onToggleTopbar: () => void;
  onToggleTopbarForCarbon: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  onToggleTopbar,
  onToggleTopbarForCarbon,
}) => {
  return (
    <div className={styles.rightSidebar}>
      <button className={styles.iconButton} onClick={onToggleTopbar} title="Toggle Topbar">
        <FontAwesomeIcon icon={faEye} size="2x" />
      </button>
      <button className={styles.iconButton} onClick={onToggleTopbarForCarbon} title="Toggle Topbar for Carbon">
        <FontAwesomeIcon icon={faCloud} size="2x" />
      </button>
    </div>
  );
};

export default RightSidebar;
