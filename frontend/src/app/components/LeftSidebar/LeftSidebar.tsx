"use client";

import React, { useState } from "react";
import styles from "./LeftSidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faShip, faUser, faRightFromBracket, faHouse } from "@fortawesome/free-solid-svg-icons";
import "~/app/fontAwesome";
import Link from "next/link";

const MenuItem = ({ href, icon, label, collapsed }: { href: string, icon: any, label: string, collapsed: boolean }) => {
  return (
    <li className={styles.menuItem}>
      <Link href={href} className={styles.link}>
        <button className={styles.button}>
          <div className={styles.icon}><FontAwesomeIcon icon={icon} /></div>
          {!collapsed && <div className={styles.text}>{label}</div>}
        </button>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    { href: "/", icon: faHouse, label: "Home" },
    { href: "/vessel", icon: faShip, label: "Vessels" },
    { href: "/profile", icon: faUser, label: "Profile" },
    { href: "/logout", icon: faRightFromBracket, label: "Logout" }
  ];

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
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
