import React from 'react';
import styles from './Topbar.module.css';
import AutoComplete from './AutoComplete';

const Topbar = () => {
  const ports = ["Port of Los Angeles", "Port of New York", "Port of Rotterdam", "Port of Shanghai", "Port of Singapore", "Port of Hamburg"];
  const middlePoints = ["Panama Canal", "Suez Canal"];
  const vessels = ["Default", "Vessel 1", "Vessel 2", "Vessel 3"];

  return (
    <div className={styles.topbar}>
      <AutoComplete placeholder="Origin Port" options={ports} required />
      <AutoComplete placeholder="Middle Point" options={middlePoints} />
      <AutoComplete placeholder="Destination Port" options={ports} required />
      <AutoComplete placeholder="Vessel" options={vessels} />
    </div>
  );
};

export default Topbar;
