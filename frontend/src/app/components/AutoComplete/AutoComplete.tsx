import React, { useState, useEffect, forwardRef } from "react";
import { UseControllerProps, FieldValues } from "react-hook-form";
import styles from "./AutoComplete.module.css";
import clearIcon from "/public/leaflet/clear-icon.png";
import deleteIcon from "/public/icons/delete-icon.png";

interface AutoCompleteProps<T extends FieldValues> extends UseControllerProps<T> {
  placeholder: string;
  options: string[];
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur: () => void;
  onSelectionChange?: (value: string) => void;
}

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps<any>>(
  ({ placeholder, options, name, value, onChange, onBlur, defaultValue, onSelectionChange }, ref) => {
    const [inputValue, setInputValue] = useState<string>(value ? String(value) : "");
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
      setFilteredOptions(options);
    }, [options]);

    useEffect(() => {
      if (value !== inputValue) {
        setInputValue(value ? String(value) : "");
      }
    }, [value, inputValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value === "") {
        onChange("");
        if (onSelectionChange) {
          onSelectionChange("");
        }
      }
      setInputValue(value);
      setFilteredOptions(options.filter((option) => option.toLowerCase().includes(value.toLowerCase())));
      setShowOptions(true);
      onChange(value);
    };

    const handleSelect = (option: string) => {
      setInputValue(option);
      setFilteredOptions([]);
      setShowOptions(false);
      onChange(option);
      if (onSelectionChange) {
        onSelectionChange(option);
      }
    };

    const handleBlur = () => {
      setShowOptions(false);
      onBlur();
    };

    const clearInput = () => {
      setInputValue("");
      onChange("");
      if (onSelectionChange) {
        onSelectionChange("");
      }
    };

    return (
      <div className={styles.autocomplete}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setShowOptions(true)}
            onBlur={handleBlur}
            className={styles.input}
            ref={ref}
          />
          {inputValue && (
            <button type="button" className={styles.clearButton} onClick={clearInput}>
              <img src={deleteIcon.src} alt="Clear" className={styles.clearIcon} width={18} height={18} />
            </button>
          )}
        </div>
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
  }
);

AutoComplete.displayName = "AutoComplete";

export default AutoComplete;
