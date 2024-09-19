import React, { useState, useEffect, forwardRef } from "react";
import { useController, UseControllerProps, FieldValues } from "react-hook-form";
import styles from "./AutoComplete.module.css";

interface AutoCompleteProps<T extends FieldValues> extends UseControllerProps<T> {
  placeholder: string;
  options: string[];
  onSelectionChange?: (value: string) => void;
}

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps<any>>(
  ({ placeholder, options, name, control, rules, defaultValue, onSelectionChange }, ref) => {
    const { field } = useController<any>({ name, control, rules, defaultValue });
    const [inputValue, setInputValue] = useState<string>(field.value ? String(field.value) : "");
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
      setFilteredOptions(options);
    }, [options]);

    useEffect(() => {
      setInputValue(field.value ? String(field.value) : "");
    }, [field.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setFilteredOptions(options.filter((option) => option.toLowerCase().includes(value.toLowerCase())));
      setShowOptions(true);
      field.onChange(value);
    };

    const handleSelect = (option: string) => {
      setInputValue(option);
      setFilteredOptions([]);
      setShowOptions(false);
      field.onChange(option);
      if (onSelectionChange) {
        onSelectionChange(option);
      }
    };

    const handleBlur = () => {
      setShowOptions(false);
      field.onBlur();
    };

    return (
      <div className={styles.autocomplete}>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setShowOptions(true)}
          onBlur={handleBlur}
          className={`${styles.input}`}
          ref={ref}
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
  }
);

AutoComplete.displayName = "AutoComplete";

export default AutoComplete;
