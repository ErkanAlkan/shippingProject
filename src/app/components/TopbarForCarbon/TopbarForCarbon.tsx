"use client";
import React, { useState, useEffect } from 'react';
import styles from './TopbarForCarbon.module.css';
import AutoComplete from '../AutoComplete/AutoComplete';

const TopbarForCarbon = () => {
  const vessels = ["Default", "Vessel 1", "Vessel 2", "Vessel 3"];

  const getDefaultDate = () => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return now.toISOString().slice(0, 16);
  };

  const [totalTime, setTotalTime] = useState<string>('');
  const [averageSpeed, setAverageSpeed] = useState<string>('');
  const [startingDate, setStartingDate] = useState<string>(getDefaultDate);
  const [arrivalDate, setArrivalDate] = useState<string>(getDefaultDate);

  useEffect(() => {
    if (startingDate && arrivalDate) {
      const start = new Date(startingDate);
      const arrival = new Date(arrivalDate);
      const diffTime = Math.abs(arrival.getTime() - start.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      setTotalTime(diffDays.toFixed(2));
      setAverageSpeed('');
    }
  }, [startingDate, arrivalDate]);

  const handleTotalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) >= 0 || value === '') {
      setTotalTime(value);
      setAverageSpeed('');
    }
  };

  const handleAverageSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) >= 0 || value === '') {
      setAverageSpeed(value);
      setTotalTime('');
      setArrivalDate('');
    }
  };

  const handleStartingDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartingDate(e.target.value);
  };

  const handleArrivalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalDate('e.target.value');
  };

  const handleReset = () => {
    const defaultDate = getDefaultDate();
    setTotalTime('');
    setAverageSpeed('');
    setStartingDate(defaultDate);
    setArrivalDate(defaultDate);
  };

  const handleCalculate = () => {
    alert('Calculate button clicked');
  };

  return (
    <div className={styles.topbarForCarbon}>
      <AutoComplete placeholder="Vessel" options={vessels} />

      <div className={styles.inputGroup}>
        <label className={styles.label}>Total Time (days)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Total Time"
          value={totalTime}
          onChange={handleTotalTimeChange}
          className={styles.input}
        />
        <label className={styles.label}>Average Speed</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Average Speed"
          value={averageSpeed}
          onChange={handleAverageSpeedChange}
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Starting Date</label>
        <input
          type="datetime-local"
          placeholder="Starting Date and Time"
          value={startingDate}
          onChange={handleStartingDateChange}
          className={`${styles.input} ${styles.dateInput}`}
        />
        <label className={styles.label}>Arrival Date</label>
        <input
          type="datetime-local"
          placeholder="Arrival Date and Time"
          value={arrivalDate}
          onChange={handleArrivalDateChange}
          className={`${styles.input} ${styles.dateInput}`}
          min={startingDate}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button className={`${styles.button} ${styles.reset}`}onClick={handleReset}>Reset</button>
        <button className={styles.button} onClick={handleCalculate}>Calculate</button>
      </div>
    </div>
  );
};

export default TopbarForCarbon;
