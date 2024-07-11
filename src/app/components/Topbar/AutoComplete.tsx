"use client";
import React, { useState, useEffect } from 'react';
import styles from './AutoComplete.module.css';

interface AutoCompleteProps {
  placeholder: string;
  options: string[];
  required?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ placeholder, options, required = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isValid, setIsValid] = useState(!required);

  useEffect(() => {
    setFilteredOptions(options.slice(0, 5));
  }, [options]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setFilteredOptions(options.filter(option => option.toLowerCase().includes(value.toLowerCase())));
    setShowOptions(true);
    if (required) {
      setIsValid(value.trim() !== '');
    }
  };

  const handleFocus = () => {
    setShowOptions(true);
    setFilteredOptions(options.slice(0, 5));
  };

  const handleSelect = (option: string) => {
    setInputValue(option);
    setShowOptions(false);
    if (required) {
      setIsValid(option.trim() !== '');
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
      if (required) {
        setIsValid(inputValue.trim() !== '');
      }
    }, 200);
  };

  return (
    <div className={styles.autocomplete}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles.input} ${required && !isValid ? styles.invalid : ''}`}
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul className={styles.options}>
          {filteredOptions.map((option, index) => (
            <li key={index} onMouseDown={() => handleSelect(option)} className={styles.option}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
