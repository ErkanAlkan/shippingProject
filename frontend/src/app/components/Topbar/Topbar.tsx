import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import styles from "./Topbar.module.css";
import AutoComplete from "../AutoComplete/AutoComplete";
import { showErrorAlert, showLoadingAlert } from "~/utils/sweetAlertUtils";
import Swal from "sweetalert2";
import { useRouteContext } from "~/app/context/RouteContext";
import { usePortContext } from "~/app/context/PortContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface TopBarFormData {
  originPort: string;
  middlePoint1?: string;
  middlePoint2?: string;
  destinationPort: string;
}

const Topbar = () => {
  const { globalRouteData, setGlobalRouteData } = useRouteContext();
  const {
    portOptions,
    selectedOriginPort,
    setSelectedOriginPort,
    selectedDestinationPort,
    setSelectedDestinationPort,
    middlePoint1,
    middlePoint2,
    setMiddlePoint1,
    setMiddlePoint2,
    middlePointOptions,
  } = usePortContext();

  const portNames = portOptions.map((port) => port.origin);

  const handleOriginChange = async (value: string) => {
    if (value === "") {
      setSelectedOriginPort(null);
    } else {
      setSelectedOriginPort(value);
    }
    await trigger("originPort");
  };

  const handleDestinationChange = async (value: string) => {
    if (value === "") {
      setSelectedDestinationPort(null);
    } else {
      setSelectedDestinationPort(value);
    }
    await trigger("destinationPort");
  };

  const handleMiddlePoint1Change = async (value: string) => {
    if (value === "") {
      setMiddlePoint1(null);
    } else {
      setMiddlePoint1(value);
    }
    await trigger("middlePoint1");
  };

  const handleMiddlePoint2Change = async (value: string) => {
    if (value === "") {
      setMiddlePoint2(null);
    } else {
      setMiddlePoint2(value);
    }
    await trigger("middlePoint2");
  };

  const handleReset = () => {
    reset({
      originPort: "",
      middlePoint1: "",
      middlePoint2: "",
      destinationPort: "",
    });
    setSelectedOriginPort(null);
    setSelectedDestinationPort(null);
    setMiddlePoint1(null);
    setMiddlePoint2(null);
    setGlobalRouteData([]);
  };

  const validationSchema = Yup.object().shape({
    originPort: Yup.string().required("Origin Port is required").oneOf(portNames, "Select a valid port"),
    middlePoint1: Yup.string().oneOf(["", ...middlePointOptions], "Select a valid middle"),
    middlePoint2: Yup.string()
      .oneOf(["", ...middlePointOptions], "Select a valid middle")
      .test("not-same-as-middlePoint1", "Same as Middle Point 1", function (value) {
        const { middlePoint1 } = this.parent;
        return middlePoint1 === "" || value !== middlePoint1;
      }),
    destinationPort: Yup.string()
      .required("Destination Port is required")
      .oneOf(portNames, "Select a valid port")
      .test("not-same-as-origin", "Same as origin port", function (value) {
        const { originPort } = this.parent;
        return originPort !== value;
      }),
  });

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<TopBarFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      originPort: "",
      middlePoint1: "",
      middlePoint2: "",
      destinationPort: "",
    },
  });
  useEffect(() => {
    if (selectedOriginPort) {
      setValue("originPort", selectedOriginPort);
      trigger("originPort");
    }
  }, [selectedOriginPort, setValue, trigger]);

  useEffect(() => {
    if (selectedDestinationPort) {
      setValue("destinationPort", selectedDestinationPort);
      trigger("destinationPort");
    }
  }, [selectedDestinationPort, setValue, trigger]);

  useEffect(() => {
    if (middlePoint1) setValue("middlePoint1", middlePoint1);
    trigger("middlePoint1");
  }, [middlePoint1, setValue, trigger]);

  useEffect(() => {
    if (middlePoint2) setValue("middlePoint2", middlePoint2);
    trigger("middlePoint2");
  }, [middlePoint2, setValue, trigger]);

  const onSubmit = async (data: TopBarFormData) => {
    try {
      showLoadingAlert();
      const response = await axios.post(
        `${API_BASE_URL}/api/ship/get-route`,
        {
          origin: data.originPort,
          destination: data.destinationPort,
          middlePoints: [data.middlePoint1, data.middlePoint2].filter(Boolean),
        },
        { withCredentials: true }
      );
      const routeData = response.data;
      setGlobalRouteData(routeData);
      Swal.close();
    } catch (error) {
      Swal.close();
      console.error("Error fetching route data:", error);
      showErrorAlert("Fetching route data failed!");
    }
  };

  const renderInput = (
    name: keyof TopBarFormData,
    label: string,
    options: string[],
    onSelectionChangeHandler: (value: string) => void
  ) => {
    const placeholder = name === "originPort" || name === "destinationPort" ? "Select Port" : "Select Point";

    return (
      <div className={styles.inputContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>{label}</label>
          <div className={styles.inputField}>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <AutoComplete
                  {...field}
                  placeholder={placeholder}
                  options={options}
                  onSelectionChange={(value) => {
                    field.onChange(value);
                    onSelectionChangeHandler(value);
                  }}
                />
              )}
            />
            {errors[name] && <span className={styles.error}>{errors[name]?.message}</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.topbar}>
      <div className={styles.row}>
        {renderInput("originPort", "Origin Port", portNames, handleOriginChange)}
        {renderInput("destinationPort", "Destination Port", portNames, handleDestinationChange)}
      </div>
      <div className={styles.row}>
        {renderInput("middlePoint1", "Middle Point 1", middlePointOptions, handleMiddlePoint1Change)}
        {renderInput("middlePoint2", "Middle Point 2", middlePointOptions, handleMiddlePoint2Change)}
      </div>
      <div className={styles.buttonRow}>
        <button type="submit" className={styles.submitButton}>
          Run
        </button>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default Topbar;
