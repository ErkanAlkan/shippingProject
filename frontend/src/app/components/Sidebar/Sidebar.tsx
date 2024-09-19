"use client";

import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faShip, faUser, faRightFromBracket,faHouse } from "@fortawesome/free-solid-svg-icons";
import "~/app/fontAwesome";
import Link from "next/link";

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
          <Link href="/">
            <button className={styles.button}>
              <FontAwesomeIcon icon={faHouse} />
              {!collapsed && " Home"}
            </button>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <Link href="/vessel">
            <button className={styles.button}>
              <FontAwesomeIcon icon={faShip} />
              {!collapsed && " Vessels"}
            </button>
          </Link>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.button}>
            <FontAwesomeIcon icon={faUser} />
            {!collapsed && " Profile"}
          </button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.button}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            {!collapsed && " Logout"}
          </button>
        </li>
      </ul>
    </div>
  );
  
};

export default Sidebar;
