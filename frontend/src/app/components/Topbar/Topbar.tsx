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
  } = usePortContext();
  const [middlePointOptions, setMiddlePointOptions] = useState<string[]>([]);

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

  const handleReset = () => {
    reset({
      originPort: "",
      middlePoint1: "",
      middlePoint2: "",
      destinationPort: "",
    });
    setSelectedOriginPort(null);
    setSelectedDestinationPort(null);
    setGlobalRouteData([]);
  };

  useEffect(() => {
    const fetchMiddlePoints = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/unique-ports/get-middle-points`);
        setMiddlePointOptions(response.data);
      } catch (error) {
        console.error("Error fetching middle points:", error);
        showErrorAlert("Failed to fetch middle points");
      }
    };

    fetchMiddlePoints();
  }, []);

  const validationSchema = Yup.object().shape({
    originPort: Yup.string().required("Origin Port is required").oneOf(portNames, "Select a valid port"),
    middlePoint1: Yup.string().oneOf(["", ...middlePointOptions], "Select a valid middle"),
    middlePoint2: Yup.string().oneOf(["", ...middlePointOptions], "Select a valid middle"),
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
    console.log("useEffect ~ selectedOriginPort:", selectedOriginPort);
    if (selectedOriginPort) {
      setValue("originPort", selectedOriginPort);
      trigger("originPort");
    }
  }, [selectedOriginPort, setValue, trigger]);

  useEffect(() => {
    console.log("useEffect ~ selectedDestinationPort:", selectedDestinationPort);
    if (selectedDestinationPort) {
      setValue("destinationPort", selectedDestinationPort);
      trigger("destinationPort");
    }
  }, [selectedDestinationPort, setValue, trigger]);

  useEffect(() => {
    if (globalRouteData.length > 0) {
      const firstPoint = globalRouteData[0];
      const lastPoint = globalRouteData[globalRouteData.length - 1];

      setValue("originPort", firstPoint.origin || "");
      setValue("destinationPort", lastPoint.destination || "");

      const middlePoints = globalRouteData.slice(1, globalRouteData.length - 1);
      let middlePoint1 = "";
      let middlePoint2 = "";

      for (const point of middlePoints) {
        if (middlePointOptions.includes(point.origin) || middlePointOptions.includes(point.destination)) {
          const matchedPoint = middlePointOptions.includes(point.origin) ? point.origin : point.destination;

          if (!middlePoint1) {
            middlePoint1 = matchedPoint;
            setValue("middlePoint1", matchedPoint);
          } else if (!middlePoint2 && matchedPoint !== middlePoint1) {
            middlePoint2 = matchedPoint;
            setValue("middlePoint2", matchedPoint);
            break;
          }
        }
      }
    }
  }, [globalRouteData, setValue]);

  const onSubmit = async (data: TopBarFormData) => {
    try {
      showLoadingAlert("Fetching route data, please wait!");
      const response = await axios.post(`${API_BASE_URL}/api/ship/get-route`, {
        origin: data.originPort,
        destination: data.destinationPort,
        middlePoints: [data.middlePoint1, data.middlePoint2].filter(Boolean),
      });
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
        {renderInput("middlePoint1", "Middle Point 1", middlePointOptions, () => {})}
        {renderInput("middlePoint2", "Middle Point 2", middlePointOptions, () => {})}
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
