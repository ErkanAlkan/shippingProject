"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import styles from './TopbarForCarbon.module.css';
import AutoComplete from '../AutoComplete/AutoComplete';

interface TopbarForCarbonFormData {
  vessel: string;
  totalTime?: number;
  averageSpeed?: number;
  startingDate: Date;
  arrivalDate: Date;
  inputType: number;
}

const validationSchema = Yup.object().shape({
  vessel: Yup.string().required('Vessel is required').oneOf([
    'Default', 'Vessel 1', 'Vessel 2', 'Vessel 3'
  ], 'Select a valid vessel'),
  totalTime: Yup.number().when('inputType', {
    is: (value: number) => value === 0,
    then: schema => schema.required('Total Time is required').min(0, 'Total Time must be greater than or equal to 0'),
    otherwise: schema => schema.nullable(),
  }),
  averageSpeed: Yup.number().when('inputType', {
    is: (value: number) => value === 1,
    then: schema => schema.required('Average Speed is required').min(0, 'Average Speed must be greater than or equal to 0'),
    otherwise: schema => schema.nullable(),
  }),
  startingDate: Yup.date().required('Starting Date is required'),
  arrivalDate: Yup.date().min(Yup.ref('startingDate'), 'Arrival Date cannot be before Starting Date').required('Arrival Date is required'),
  inputType: Yup.number().required(),
});

const TopbarForCarbon = () => {
  const { handleSubmit, control, watch, setValue } = useForm<TopbarForCarbonFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      inputType: 0,
      totalTime: undefined,
      averageSpeed: undefined,
      startingDate: new Date(),
      arrivalDate: new Date(),
      vessel: '',
    },
  });

  const [selectedOption, setSelectedOption] = React.useState<string>("");

  const inputType = watch('inputType');
  const vessels = ["Default", "Vessel 1", "Vessel 2", "Vessel 3"];
  const totalTimeOptions = ["None", "Starting Date", "Arrival Date"];
  const avgSpeedOptions = ["None", "Starting Date", "Arrival Date"];
  const exactDatesOptions = ["Starting & Arrival Dates"];
  const autoCompleteOptions = inputType === 0 ? totalTimeOptions : inputType === 1 ? avgSpeedOptions : [exactDatesOptions[0]];

  useEffect(() => {
    if (inputType === 2) {
      setSelectedOption(exactDatesOptions[0]);
    } else if (inputType === 1 || inputType === 0){
      setSelectedOption("");
    }
  }, [inputType]);

  const handleReset = () => {
    setValue('totalTime', undefined);
    setValue('averageSpeed', undefined);
    setValue('startingDate', new Date());
    setValue('arrivalDate', new Date());
    setValue('inputType', 0);
    setSelectedOption('');
  };

  const onSubmit = (data: TopbarForCarbonFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.topbarForCarbon}>
      <div className={styles.vesselContainer}>
        <label>Vessels:</label>
        <div className={styles.fullWidthAutoComplete}>
          <Controller
            name="vessel"
            control={control}
            render={({ field }) => (
              <AutoComplete<TopbarForCarbonFormData>
                {...field}
                control={control}
                placeholder="Select Vessel"
                options={vessels}
                required
              />
            )}
          />
        </div>
      </div>

      <div className={styles.sliderInputContainer}>
        <div className={styles.buttonGroup}>
          <div
            className={`${styles.buttonSlider} ${
              inputType === 1
                ? styles.middle
                : inputType === 2
                ? styles.right
                : ""
            }`}
          />
          <div
            className={
              inputType === 0
                ? `${styles.toggleButton} ${styles.active}`
                : styles.toggleButton
            }
            onClick={() => setValue('inputType', 0)}
          >
            Total Time
          </div>
          <div
            className={
              inputType === 1
                ? `${styles.toggleButton} ${styles.active}`
                : styles.toggleButton
            }
            onClick={() => setValue('inputType', 1)}
          >
            Avg Speed
          </div>
          <div
            className={
              inputType === 2
                ? `${styles.toggleButton} ${styles.active}`
                : styles.toggleButton
            }
            onClick={() => setValue('inputType', 2)}
          >
            Exact Dates
          </div>
        </div>
        {inputType === 0 && (
          <Controller
            name="totalTime"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="Days"
                className={`${styles.input} ${styles.inputMargin}`}
              />
            )}
          />
        )}
        {inputType === 1 && (
          <Controller
            name="averageSpeed"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="nm/h"
                className={`${styles.input} ${styles.inputMargin}`}
              />
            )}
          />
        )}
        <select
          className={`${styles.select} ${
            selectedOption === "" ? styles.placeholderSelected : ""
          }`}
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="" disabled hidden className={styles.placeholderOption}>
            Departure/Arrival
          </option>
          {autoCompleteOptions.map((option) => (
            <option key={option} value={option} className={styles.normalOption}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {((inputType === 0 || inputType === 1) && selectedOption === "Starting Date") || (inputType === 2 && selectedOption === exactDatesOptions[0]) ? (
        <div className={styles.formGroup}>
          <label>Starting Date</label>
          <Controller
            name="startingDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                placeholder="Starting Date and Time"
                value={field.value.toISOString().slice(0, 16)}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className={styles.input}
              />
            )}
          />
        </div>
      ) : null}

      {((inputType === 0 || inputType === 1) && selectedOption === "Arrival Date") || (inputType === 2 && selectedOption === exactDatesOptions[0]) ? (
        <div className={styles.formGroup}>
          <label>Arrival Date</label>
          <Controller
            name="arrivalDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                placeholder="Arrival Date and Time"
                value={field.value.toISOString().slice(0, 16)}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className={styles.input}
                min={field.value.toISOString().slice(0, 16)}
              />
            )}
          />
        </div>
      ) : null}

      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={handleReset}
          className={`${styles.button} ${styles.buttonReset}`}
        >
          Reset
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonCalculate}`}
        >
          Calculate
        </button>
      </div>
    </form>
  );
};

export default TopbarForCarbon;
