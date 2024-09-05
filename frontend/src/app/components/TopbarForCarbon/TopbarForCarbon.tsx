"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import styles from './TopbarForCarbon.module.css';
import AutoComplete from '../AutoComplete/AutoComplete';

interface TopbarForCarbonFormData {
  vessel: string;
  totalTime?: number | null;
  averageSpeed?: number | null;
  startingDate?: Date | null;
  arrivalDate?: Date | null;
  inputType: number;
}

const validationSchema = Yup.object().shape({
  vessel: Yup.string().required('Vessel is required').oneOf([
    'Default', 'Vessel 1', 'Vessel 2', 'Vessel 3'
  ], 'Select a valid vessel'),
  totalTime: Yup.number().nullable().when('inputType', {
    is: (value: number) => value === 0,
    then: schema => schema.required('Total Time is required').min(0, 'Total Time must be greater than or equal to 0'),
    otherwise: schema => schema.nullable(),
  }),
  averageSpeed: Yup.number().nullable().when('inputType', {
    is: (value: number) => value === 1,
    then: schema => schema.required('Average Speed is required').min(0, 'Average Speed must be greater than or equal to 0'),
    otherwise: schema => schema.nullable(),
  }),
  startingDate: Yup.date().nullable().when('inputType', {
    is: (value: number) => value === 2,
    then: schema => schema.required('Starting Date is required'),
    otherwise: schema => schema.nullable(),
  }),
  arrivalDate: Yup.date().nullable().min(Yup.ref('startingDate'), 'Arrival Date cannot be before Departure date').when('inputType', {
    is: (value: number) => value === 2,
    then: schema => schema.required('Arrival Date is required'),
    otherwise: schema => schema.nullable(),
  }),
  inputType: Yup.number().required(),
});

const TopbarForCarbon = () => {
  const { handleSubmit, control, watch, reset, setValue } = useForm<TopbarForCarbonFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      inputType: 0,
      totalTime: null,
      averageSpeed: null,
      startingDate: null,
      arrivalDate: null,
      vessel: '',
    },
  });

  const [selectedOption, setSelectedOption] = React.useState<string>("");

  const inputType = watch('inputType');
  const vessel = watch('vessel');
  const vessels = ["Default", "Vessel 1", "Vessel 2", "Vessel 3"];
  const totalTimeOptions = ["None", "Departure date", "Arrival Date"];
  const avgSpeedOptions = ["None", "Departure date", "Arrival Date"];
  const exactDatesOptions = ["Starting & Arrival Dates"];
  const autoCompleteOptions = inputType === 0 ? totalTimeOptions : inputType === 1 ? avgSpeedOptions : [exactDatesOptions[0]];

  useEffect(() => {
    setValue('totalTime', null);
    setValue('averageSpeed', null);
    setValue('startingDate', null);
    setValue('arrivalDate', null);
  
    if (inputType === 2) {
      setSelectedOption("Starting & Arrival Dates");
    } else {
      setSelectedOption('');
    }
  }, [inputType, setValue]);

  const handleReset = () => {
    reset({
      vessel,
      totalTime: null,
      averageSpeed: null,
      startingDate: null,
      arrivalDate: null,
      inputType: 0,
    });
    setSelectedOption('');
  };

  const onSubmit = (data: TopbarForCarbonFormData) => {
    const submissionData = {
      ...data,
      startingDate: selectedOption === "Departure date" || selectedOption === exactDatesOptions[0] ? data.startingDate : null,
      arrivalDate: selectedOption === "Arrival Date" || selectedOption === exactDatesOptions[0] ? data.arrivalDate : null,
    };

    console.log(submissionData);
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
              <AutoComplete
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
                value={field.value ?? ""}
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
                value={field.value ?? ""}
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

      {((inputType === 0 || inputType === 1) && selectedOption === "Departure date") || (inputType === 2 && selectedOption === exactDatesOptions[0]) ? (
        <div className={styles.formGroup}>
          <label>Departure date</label>
          <Controller
            name="startingDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="datetime-local"
                placeholder="Departure date and Time"
                value={field.value ? field.value.toISOString().slice(0, 16) : ""}
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
                value={field.value ? field.value.toISOString().slice(0, 16) : ""}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className={styles.input}
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
