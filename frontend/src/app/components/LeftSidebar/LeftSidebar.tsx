"use client";

import React, { useState, useRef } from "react";
import styles from "./LeftSidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnchor, faShip, faUser, faRightFromBracket, faHouse } from "@fortawesome/free-solid-svg-icons";
import "~/app/fontAwesome";
import Link from "next/link";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const MenuItem = ({
  href,
  icon,
  label,
  collapsed,
  onClick,
}: {
  href: string;
  icon: any;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}) => {
  return (
    <li className={styles.menuItem}>
      <Link href={href} className={styles.link} onClick={onClick}>
        <button className={styles.button}>
          <div className={styles.icon}>
            <FontAwesomeIcon icon={icon} />
          </div>
          {!collapsed && <div className={styles.text}>{label}</div>}
        </button>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setCollapsed(false), 500);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCollapsed(true);
  };

  const menuItems = [
    { href: "/", icon: faHouse, label: "Home" },
    { href: "/vessel", icon: faShip, label: "Vessels" },
    { href: "/profile", icon: faUser, label: "Profile" },
    {
      href: "#",
      icon: faRightFromBracket,
      label: "Logout",
      onClick: async () => {
        try {
          await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
          window.location.href = "/";
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    },
  ];

  return (
    <div
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
            onClick={item.onClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
