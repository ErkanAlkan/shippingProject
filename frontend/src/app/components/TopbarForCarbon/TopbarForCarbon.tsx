"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./TopbarForCarbon.module.css";
import AutoComplete from "../AutoComplete/AutoComplete";
import axios from "axios";
import { showWarningAlert, showLoadingAlert, showErrorAlert } from "~/utils/sweetAlertUtils";
import Swal from "sweetalert2";
import TableForCarbon from "../TableForCarbon/TableForCarbon";
import { RouteData } from "../../../app/types/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface TopbarForCarbonFormData {
  vessel: string;
  totalTime?: number | null;
  averageSpeed?: number | null;
  departureDate?: Date | null;
  arrivalDate?: Date | null;
  inputType: number;
  draftLevel?: number | null;
}

interface TopbarForCarbonProps {
  totalDistance: number;
  globalRouteData: RouteData[];
}

const validationSchema = Yup.object().shape({
  vessel: Yup.string()
    .required("Vessel is required")
    .oneOf(["Belaja", "Prabhu Sakhawat", "Lady J"], "Select a valid vessel"),
  totalTime: Yup.number()
    .nullable()
    .when("inputType", {
      is: (value: number) => value === 0,
      then: (schema) =>
        schema
          .required("Total Time is required")
          .min(0, "Total Time must be greater than or equal to 0")
          .max(99, "Total Time must be smaller than or equal to 99"),
      otherwise: (schema) => schema.nullable(),
    }),
  averageSpeed: Yup.number()
    .nullable()
    .when("inputType", {
      is: (value: number) => value === 1,
      then: (schema) =>
        schema
          .required("Average Speed is required")
          .min(0, "Average Speed must be greater than or equal to 0")
          .max(20, "Average Speed must be smaller than or equal to 20"),
      otherwise: (schema) => schema.nullable(),
    }),
  departureDate: Yup.date()
    .nullable()
    .when("inputType", {
      is: (value: number) => value === 2,
      then: (schema) => schema.required("Departure Date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  arrivalDate: Yup.date()
    .nullable()
    .min(Yup.ref("departureDate"), "Arrival Date cannot be before Departure date")
    .when("inputType", {
      is: (value: number) => value === 2,
      then: (schema) => schema.required("Arrival Date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  inputType: Yup.number().required(),
  draftLevel: Yup.number()
    .nullable()
    .min(1, "Draft Level must be greater than or equal to 1")
    .max(20, "Draft level must be smaller than or equal to 20"),
});

const TopbarForCarbon: React.FC<TopbarForCarbonProps> = ({ totalDistance }) => {
  const [combinedContent, setCombinedContent] = useState(null);
  const { handleSubmit, control, watch, reset, setValue } = useForm<TopbarForCarbonFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      inputType: 0,
      totalTime: null,
      averageSpeed: null,
      departureDate: null,
      arrivalDate: null,
      vessel: "",
      draftLevel: 10,
    },
  });

  const [selectedOption, setSelectedOption] = React.useState<string>("");

  const inputType = watch("inputType");
  const vessel = watch("vessel");
  const vessels = ["Belaja", "Prabhu Sakhawat", "Lady J"];
  const totalTimeOptions = ["None", "Departure date", "Arrival Date"];
  const avgSpeedOptions = ["None", "Departure date", "Arrival Date"];
  const exactDatesOptions = ["Departure & Arrival Dates"];
  const autoCompleteOptions =
    inputType === 0 ? totalTimeOptions : inputType === 1 ? avgSpeedOptions : [exactDatesOptions[0]];

  useEffect(() => {
    setValue("totalTime", null);
    setValue("averageSpeed", null);
    setValue("departureDate", null);
    setValue("arrivalDate", null);

    if (inputType === 2) {
      setSelectedOption("Departure & Arrival Dates");
    } else {
      setSelectedOption("");
    }
  }, [inputType, setValue]);

  const handleReset = () => {
    reset({
      vessel,
      totalTime: null,
      averageSpeed: null,
      departureDate: null,
      arrivalDate: null,
      inputType: 0,
      draftLevel: null,
    });
    setSelectedOption("");
  };

  const onSubmit = (data: TopbarForCarbonFormData) => {
    if (!totalDistance) {
      showWarningAlert("Route not selected. Please choose a route first!");
      return;
    }
    const submissionData = {
      ...data,
      departureDate:
        selectedOption === "Departure date" || selectedOption === exactDatesOptions[0] ? data.departureDate : null,
      arrivalDate:
        selectedOption === "Arrival Date" || selectedOption === exactDatesOptions[0] ? data.arrivalDate : null,
      totalDistance,
    };
    showLoadingAlert();
    axios
      .post(`${API_BASE_URL}/api/carbon/calculate-stats`, submissionData , { withCredentials: true })
      .then((response) => {
        const { combinedContent } = response.data;
        setCombinedContent(combinedContent);
        Swal.close();
      })
      .catch((error) => {
        Swal.close();
        console.error("Error submitting data:", error);
        showErrorAlert("Failed to submit data!");
      });
  };

  const formatDateTimeInput = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().slice(0, 16);
  };

  const handleDateChange = (value: string | undefined, fieldOnChange: (value: Date | null) => void) => {
    if (!value) {
      fieldOnChange(null);
      return;
    }

    const newDate = new Date(value);
    if (!isNaN(newDate.getTime())) {
      fieldOnChange(newDate);
    } else {
      fieldOnChange(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.topbarForCarbon}>
        <div className={styles.vesselContainer}>
          <label>Vessel:</label>
          <div className={styles.fullWidthAutoComplete}>
            <Controller
              name="vessel"
              control={control}
              render={({ field }) => <AutoComplete {...field} placeholder="Select Vessel" options={vessels} />}
            />
          </div>
          <label>Draft:</label>
          <Controller
            name="draftLevel"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                placeholder="meters"
                className={`${styles.input} ${styles.inputMargin}`}
                value={field.value ?? ""}
                min="0"
                step="0.01"
              />
            )}
          />
        </div>

        <div className={styles.sliderInputContainer}>
          <div className={styles.buttonGroup}>
            <div
              className={`${styles.buttonSlider} ${
                inputType === 1 ? styles.middle : inputType === 2 ? styles.right : ""
              }`}
            />
            <div
              className={inputType === 0 ? `${styles.toggleButton} ${styles.active}` : styles.toggleButton}
              onClick={() => setValue("inputType", 0)}
            >
              Total Time
            </div>
            <div
              className={inputType === 1 ? `${styles.toggleButton} ${styles.active}` : styles.toggleButton}
              onClick={() => setValue("inputType", 1)}
            >
              Avg Speed
            </div>
            <div
              className={inputType === 2 ? `${styles.toggleButton} ${styles.active}` : styles.toggleButton}
              onClick={() => setValue("inputType", 2)}
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
                  placeholder="knot"
                  className={`${styles.input} ${styles.inputMargin}`}
                  value={field.value ?? ""}
                  min="0"
                />
              )}
            />
          )}

          <select
            className={`${styles.select} ${selectedOption === "" ? styles.placeholderSelected : ""}`}
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

        {((inputType === 0 || inputType === 1) && selectedOption === "Departure date") ||
        (inputType === 2 && selectedOption === exactDatesOptions[0]) ? (
          <div className={styles.formGroup}>
            <label>Departure date</label>
            <Controller
              name="departureDate"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="datetime-local"
                  placeholder="Departure date and Time"
                  value={formatDateTimeInput(field.value ?? null)}
                  onChange={(e) => handleDateChange(e.target.value, field.onChange)}
                  className={styles.input}
                />
              )}
            />
          </div>
        ) : null}

        {((inputType === 0 || inputType === 1) && selectedOption === "Arrival Date") ||
        (inputType === 2 && selectedOption === exactDatesOptions[0]) ? (
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
                  value={formatDateTimeInput(field.value ?? null)}
                  onChange={(e) => handleDateChange(e.target.value, field.onChange)}
                  className={styles.input}
                />
              )}
            />
          </div>
        ) : null}

        <div className={styles.buttonContainer}>
          <button type="submit" className={`${styles.button} ${styles.buttonCalculate}`}>
            Calculate
          </button>
          <button type="button" onClick={handleReset} className={`${styles.button} ${styles.buttonReset}`}>
            Reset
          </button>
        </div>
      </form>
      {combinedContent && <TableForCarbon combinedContent={combinedContent} />}
    </>
  );
};

export default TopbarForCarbon;
