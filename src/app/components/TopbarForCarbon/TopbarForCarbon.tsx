"use client";
import React, { useState, useEffect } from 'react';
import styles from './TopbarForCarbon.module.css';

const TopbarForCarbon = () => {
  const vessels = ["Default", "Vessel 1", "Vessel 2", "Vessel 3"];
  const totalTimeOptions = ["None", "Starting Date", "Arrival Date"];
  const avgSpeedOptions = ["None", "Starting Date", "Arrival Date"];
  const exactDatesOptions = ["Starting & Arrival Dates"];

  const getDefaultDate = () => {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return now.toISOString().slice(0, 16);
  };

  const [totalTime, setTotalTime] = useState<string>('');
  const [averageSpeed, setAverageSpeed] = useState<string>('');
  const [startingDate, setStartingDate] = useState<string>(getDefaultDate);
  const [arrivalDate, setArrivalDate] = useState<string>(getDefaultDate);
  const [inputType, setInputType] = useState<number>(0); // 0 for Total Time, 1 for Average Speed, 2 for Exact Dates
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<string[]>(totalTimeOptions);
  const [selectedOption, setSelectedOption] = useState<string>('None');

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

  useEffect(() => {
    if (inputType === 0) {
      setAutoCompleteOptions(totalTimeOptions);
      setSelectedOption('None');
    } else if (inputType === 1) {
      setAutoCompleteOptions(avgSpeedOptions);
      setSelectedOption('None');
    } else if (inputType === 2) {
      setAutoCompleteOptions([exactDatesOptions[0]]);
      setSelectedOption(exactDatesOptions[0]);
    }
  }, [inputType]);

  const handleTotalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) >= 0 || value === '') {
      setTotalTime(value);
    }
  };

  const handleAverageSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) >= 0 || value === '') {
      setAverageSpeed(value);
    }
  };

  const handleStartingDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartingDate(e.target.value);
  };

  const handleArrivalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalDate(e.target.value);
  };

  const handleOptionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleReset = () => {
    const defaultDate = getDefaultDate();
    setTotalTime('');
    setAverageSpeed('');
    setStartingDate(defaultDate);
    setArrivalDate(defaultDate);
    setInputType(0);
    setAutoCompleteOptions(totalTimeOptions);
    setSelectedOption('None');
  };

  const handleCalculate = () => {
    alert('Calculate button clicked');
  };

  return (
    <div className={styles.topbarForCarbon}>
      <div className={styles.formGroup}>
        <label>Vessels:</label>
        <input type="text" placeholder="Vessel" className={styles.input} />
      </div>

      <div className={styles.sliderInputContainer}>
        <div className={styles.buttonGroup}>
          <div className={`${styles.buttonSlider} ${inputType === 1 ? styles.middle : inputType === 2 ? styles.right : ''}`} />
          <div
            className={inputType === 0 ? `${styles.toggleButton} ${styles.active}` : styles.toggleButton}
            onClick={() => setInputType(0)}
          >
            Total Time
          </div>
          <div
            className={inputType === 1 ? `${styles.toggleButton} ${styles.active}` : styles.toggleButton}
            onClick={() => setInputType(1)}
          >
            Avg Speed
          </div>
          <div
            className={inputType === 2 ? `${styles.toggleButton} ${styles.active}` : styles.toggleButton}
            onClick={() => setInputType(2)}
          >
            Exact Dates
          </div>
        </div>
        <input
          type={inputType === 2 ? "text" : "number"}
          placeholder={inputType === 0 ? "Total Time" : inputType === 1 ? "Average Speed" : "Exact Dates"}
          value={inputType === 0 ? totalTime : inputType === 1 ? averageSpeed : ''}
          onChange={inputType === 0 ? handleTotalTimeChange : inputType === 1 ? handleAverageSpeedChange : undefined}
          className={`${styles.input} ${styles.inputMargin}`}
          readOnly={inputType === 2}
        />
        <select
          className={styles.select}
          value={selectedOption}
          onChange={handleOptionSelect}
        >
          {autoCompleteOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Starting Date</label>
        <input
          type="datetime-local"
          placeholder="Starting Date and Time"
          value={startingDate}
          onChange={handleStartingDateChange}
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Arrival Date</label>
        <input
          type="datetime-local"
          placeholder="Arrival Date and Time"
          value={arrivalDate}
          onChange={handleArrivalDateChange}
          className={styles.input}
          min={startingDate}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button onClick={handleReset} className={`${styles.button} ${styles.buttonReset}`}>Reset</button>
        <button onClick={handleCalculate} className={`${styles.button} ${styles.buttonCalculate}`}>Calculate</button>
      </div>
    </div>
  );
};

export default TopbarForCarbon;
