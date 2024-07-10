"use client";

import React, { useState } from "react";
import styles from './Sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnchor, faShip, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import '~/app/fontAwesome';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
    >
      <ul className={styles.menu}>
        <li className={styles.logoArea}>
          <FontAwesomeIcon icon={faAnchor} className={styles.logo} />
        </li>
        <li className={styles.menuItem}>
          <button className={styles.button}>
            {collapsed ? (
              <FontAwesomeIcon icon={faShip} />
            ) : (
              "Vessels"
            )}
          </button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.button}>
            {collapsed ? (
              <FontAwesomeIcon icon={faUser} />
            ) : (
              "Profile"
            )}
          </button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.button}>
            {collapsed ? (
              <FontAwesomeIcon icon={faRightFromBracket} />
            ) : (
              "Logout"
            )}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
