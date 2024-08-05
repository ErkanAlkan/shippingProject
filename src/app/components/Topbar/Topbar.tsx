"use client";

import React, { useEffect } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./Topbar.module.css";
import AutoComplete from "../AutoComplete/AutoComplete";

interface TopBarFormData {
  originPort: string;
  middlePoint?: string;
  destinationPort: string;
}

const portOptions = [
  "Port of Los Angeles",
  "Port of New York",
  "Port of Rotterdam",
  "Port of Shanghai",
  "Port of Singapore",
  "Port of Hamburg",
];

const middlePointOptions = ["Panama Canal", "Suez Canal"];
const validationSchema = Yup.object().shape({
  originPort: Yup.string()
    .required("Origin Port is required")
    .oneOf(portOptions, "Select a valid port"),

  middlePoint: Yup.string().oneOf(
    ["", ...middlePointOptions],
    "Select a valid middle point"
  ),

  destinationPort: Yup.string()
    .required("Destination Port is required")
    .oneOf(portOptions, "Select a valid port")
    .test(
      "not-same-as-origin",
      "Same as origin port",
      function (value) {
        const { originPort } = this.parent;
        return originPort !== value;
      }
    ),
});

const Topbar = () => {
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<TopBarFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      originPort: "",
      middlePoint: "",
      destinationPort: "",
    },
  });

  const originPortValue = watch("originPort");
  const destinationPortValue = watch("destinationPort");

  useEffect(() => {
    trigger(["originPort", "destinationPort"]);
  }, [trigger]);

  useEffect(() => {
    trigger("originPort");
    trigger("destinationPort");
  }, [originPortValue, destinationPortValue, trigger]);

  const onSubmit = (data: TopBarFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.topbar}>
      <div
        className={`${styles.formGroup} ${
          errors.originPort ? styles.invalid : ""
        }`}
      >
        <Controller
          name="originPort"
          control={control as Control<TopBarFormData>}
          render={({ field }) => (
            <AutoComplete
              {...field}
              control={control as Control<TopBarFormData>}
              placeholder="Origin Port"
              options={portOptions}
              required
              error={!!errors.originPort}
            />
          )}
        />
        {errors.originPort && (
          <span className={styles.error}>{errors.originPort.message}</span>
        )}
      </div>
      <div
        className={`${styles.formGroup} ${
          errors.middlePoint ? styles.invalid : ""
        }`}
      >
        <Controller
          name="middlePoint"
          control={control as Control<TopBarFormData>}
          render={({ field }) => (
            <AutoComplete
              {...field}
              control={control as Control<TopBarFormData>}
              placeholder="Middle Point"
              options={middlePointOptions}
              error={!!errors.middlePoint}
            />
          )}
        />
        {errors.middlePoint && (
          <span className={styles.error}>{errors.middlePoint.message}</span>
        )}
      </div>
      <div
        className={`${styles.formGroup} ${
          errors.destinationPort ? styles.invalid : ""
        }`}
      >
        <Controller
          name="destinationPort"
          control={control as Control<TopBarFormData>}
          render={({ field }) => (
            <AutoComplete
              {...field}
              control={control as Control<TopBarFormData>}
              placeholder="Destination Port"
              options={portOptions}
              required
              error={!!errors.destinationPort}
            />
          )}
        />
        {errors.destinationPort && (
          <span className={styles.error}>{errors.destinationPort.message}</span>
        )}
      </div>
      <button type="submit" className={styles.submitButton}>
        Submit
      </button>
    </form>
  );
};

export default Topbar;
